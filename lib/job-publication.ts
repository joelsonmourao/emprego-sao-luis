import { JobIndexingStatus, JobPublicationStatus, JobScheduleSource, JobStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { notifyGoogleIndexing, validateJobForGoogleIndexing } from "@/lib/google-indexing";
import { revalidatePublicSurfacesForJob } from "@/lib/public-revalidate";
import { getSiteUrl } from "@/lib/site-url";
import { parseScheduledAtInputToUtc } from "@/lib/scheduled-at-utc";

type IndexingLogStatus = "SUCCESS" | "ERROR" | "SKIPPED" | "RETRY";

function getJobPublicUrlForLog(slug: string) {
  try {
    return getSiteUrl(`/vagas/${slug}`);
  } catch {
    return `/vagas/${slug}`;
  }
}

async function createIndexingLog(input: {
  jobId?: string | null;
  url: string;
  type: string;
  status: IndexingLogStatus;
  httpStatus?: number | null;
  response?: Prisma.InputJsonValue | null;
  error?: string | null;
  attempts?: number;
}) {
  await prisma.indexingLog.create({
    data: {
      jobId: input.jobId ?? null,
      url: input.url,
      type: input.type,
      status: input.status,
      httpStatus: input.httpStatus ?? null,
      response: input.response ?? Prisma.JsonNull,
      error: input.error ?? null,
      attempts: input.attempts ?? 1
    }
  });
}

type JobForPublication = Prisma.JobGetPayload<{
  include: { city: true; state: true; company: true };
}>;

function toPublicMeta(job: JobForPublication) {
  return {
    slug: job.slug,
    stateSlug: job.state.slug,
    citySlug: job.city.slug,
    companySlug: job.company?.slug ?? null,
    employmentType: job.employmentType
  };
}

export async function submitPublishedJobToIndexing(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { city: true, state: true, company: true }
  });

  if (!job) {
    throw new Error("Vaga nao encontrada.");
  }

  const validation = validateJobForGoogleIndexing({
    id: job.id,
    slug: job.slug,
    title: job.title,
    summary: job.summary,
    status: job.status,
    publishedAt: job.publishedAt,
    expiresAt: job.expiresAt,
    validThrough: job.validThrough,
    city: { name: job.city?.name },
    state: { code: job.state?.code }
  });

  if (!validation.ok) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        indexingStatus: JobIndexingStatus.SKIPPED,
        indexingError: validation.reason
      }
    });
    await createIndexingLog({
      jobId: job.id,
      url: getJobPublicUrlForLog(job.slug),
      type: "URL_UPDATED",
      status: "SKIPPED",
      error: validation.reason
    });
    return { ok: false as const, skipped: true as const, message: validation.reason };
  }

  await prisma.job.update({
    where: { id: job.id },
    data: {
      indexingStatus: JobIndexingStatus.QUEUED,
      indexingError: null
    }
  });

  const result = await notifyGoogleIndexing(validation.url);

  if (!result.ok) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        indexingStatus: JobIndexingStatus.ERROR,
        indexingLastSubmittedAt: new Date(),
        indexingError: result.message
      }
    });
    await createIndexingLog({
      jobId: job.id,
      url: validation.url,
      type: "URL_UPDATED",
      status: "ERROR",
      httpStatus: result.status ?? null,
      response: (result.response as Prisma.InputJsonValue | undefined) ?? null,
      error: result.message
    });
    return { ok: false as const, skipped: false as const, message: result.message };
  }

  await prisma.job.update({
    where: { id: job.id },
    data: {
      indexingStatus: JobIndexingStatus.SENT,
      indexingLastSubmittedAt: new Date(),
      indexingError: null
    }
  });
  await createIndexingLog({
    jobId: job.id,
    url: validation.url,
    type: "URL_UPDATED",
    status: "SUCCESS",
    response: (result.response as Prisma.InputJsonValue | undefined) ?? null
  });

  return { ok: true as const, skipped: false as const, message: result.message };
}

export async function publishJobNow(jobId: string, source: JobScheduleSource = JobScheduleSource.MANUAL) {
  const now = new Date();
  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      publicationStatus: JobPublicationStatus.OK,
      status: JobStatus.PUBLISHED,
      isActive: true,
      publishedAt: now,
      scheduledAt: null,
      scheduleSource: source,
      importError: null
    },
    include: { city: true, state: true, company: true }
  });

  revalidatePublicSurfacesForJob(toPublicMeta(job));

  if (!job.autoSubmitToIndexing) {
    await prisma.job.update({
      where: { id: job.id },
      data: {
        indexingStatus: JobIndexingStatus.SKIPPED,
        indexingError: "Envio automatico desativado para esta vaga."
      }
    });
    await createIndexingLog({
      jobId: job.id,
      url: getJobPublicUrlForLog(job.slug),
      type: "URL_UPDATED",
      status: "SKIPPED",
      error: "Envio automatico desativado para esta vaga."
    });
    return {
      ok: true as const,
      job,
      indexing: { ok: false as const, skipped: true as const, message: "Envio automatico desativado para esta vaga." }
    };
  }

  const indexing = await submitPublishedJobToIndexing(job.id);
  return { ok: true as const, job, indexing };
}

export async function cancelScheduledPublication(jobId: string) {
  const current = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, status: true }
  });
  if (!current) {
    throw new Error("Vaga nao encontrada.");
  }
  if (current.status !== JobStatus.SCHEDULED) {
    throw new Error("Somente vagas agendadas podem ter agendamento cancelado.");
  }

  const job = await prisma.job.update({
    where: { id: jobId },
    data: {
      status: JobStatus.DRAFT,
      scheduledAt: null,
      scheduleSource: JobScheduleSource.MANUAL,
      importError: null
    }
  });
  return job;
}

const CRON_PUBLISH_LIMIT = 50;

export async function reconcilePublishedJobsPublicationStatus() {
  const result = await prisma.job.updateMany({
    where: {
      publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
      status: JobStatus.PUBLISHED,
      publishedAt: { not: null },
      isActive: true
    },
    data: {
      publicationStatus: JobPublicationStatus.OK
    }
  });

  return result.count;
}

export async function processDueScheduledJobs(limit = CRON_PUBLISH_LIMIT) {
  await reconcilePublishedJobsPublicationStatus();

  const now = new Date();
  const due = await prisma.job.findMany({
    where: {
      status: JobStatus.SCHEDULED,
      scheduledAt: { not: null, lte: now }
    },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: { id: true }
  });

  if (!due.length) {
    const remainingScheduled = await prisma.job.count({
      where: {
        status: JobStatus.SCHEDULED,
        scheduledAt: { not: null, lte: now }
      }
    });

    return {
      limit,
      published: 0,
      sentToIndexing: 0,
      remainingScheduled,
      indexingErrors: 0,
      publicationErrors: 0
    };
  }

  const ids = due.map((item) => item.id);
  await prisma.$transaction(async (tx) => {
    await tx.job.updateMany({
      where: { id: { in: ids } },
      data: {
        publicationStatus: JobPublicationStatus.OK,
        status: JobStatus.PUBLISHED,
        isActive: true,
        publishedAt: now,
        scheduledAt: null,
        scheduleSource: JobScheduleSource.AUTOMATICO,
        importError: null
      }
    });
  });

  let sentToIndexing = 0;
  let indexingErrors = 0;
  let publicationErrors = 0;

  for (const id of ids) {
    try {
      const job = await prisma.job.findUnique({
        where: { id },
        select: { id: true, slug: true, autoSubmitToIndexing: true }
      });
      if (!job) continue;

      if (!job.autoSubmitToIndexing) {
        await prisma.job.update({
          where: { id: job.id },
          data: {
            indexingStatus: JobIndexingStatus.SKIPPED,
            indexingError: "Envio automatico desativado para esta vaga."
          }
        });
        await createIndexingLog({
          jobId: job.id,
          url: getJobPublicUrlForLog(job.slug),
          type: "URL_UPDATED",
          status: "SKIPPED",
          error: "Envio automatico desativado para esta vaga."
        });
        continue;
      }

      const indexing = await submitPublishedJobToIndexing(job.id);
      if (indexing.ok) {
        sentToIndexing += 1;
      } else if (!indexing.skipped) {
        indexingErrors += 1;
      }
    } catch {
      publicationErrors += 1;
      await prisma.job.update({
        where: { id },
        data: {
          status: JobStatus.ERROR,
          importError: "Falha ao publicar vaga via cron."
        }
      });
    }
  }

  const published = await prisma.job.count({
    where: {
      id: { in: ids },
      status: JobStatus.PUBLISHED
    }
  });

  const remainingScheduled = await prisma.job.count({
    where: {
      status: JobStatus.SCHEDULED,
      scheduledAt: { not: null, lte: now }
    }
  });

  return {
    limit,
    published,
    sentToIndexing,
    remainingScheduled,
    indexingErrors,
    publicationErrors
  };
}

export async function fixScheduledImportPublication() {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const jobs = await prisma.job.findMany({
    where: {
      scheduleSource: JobScheduleSource.PLANILHA,
      status: JobStatus.PUBLISHED,
      scheduledImportRawValue: { not: null },
      publishedAt: { gte: todayStart }
    },
    select: {
      id: true,
      slug: true,
      scheduledImportRawValue: true
    }
  });

  let reagendadas = 0;
  let ignoradas = 0;
  let erros = 0;

  for (const job of jobs) {
    try {
      const parsed = parseScheduledAtInputToUtc(job.scheduledImportRawValue);
      if (!parsed || parsed.getTime() <= now.getTime()) {
        ignoradas += 1;
        continue;
      }

      await prisma.$transaction(async (tx) => {
        await tx.job.update({
          where: { id: job.id },
          data: {
            status: JobStatus.SCHEDULED,
            isActive: false,
            scheduledAt: parsed,
            publishedAt: null,
            indexingStatus: JobIndexingStatus.NOT_SENT,
            indexingError: null,
            indexingLastSubmittedAt: null
          }
        });

        await tx.indexingLog.deleteMany({
          where: {
            jobId: job.id,
            createdAt: { gte: todayStart }
          }
        });
      });

      reagendadas += 1;
    } catch {
      erros += 1;
    }
  }

  return {
    analisadas: jobs.length,
    reagendadas,
    ignoradas,
    erros
  };
}
