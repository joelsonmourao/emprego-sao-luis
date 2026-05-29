import { JobIndexingStatus, JobPublicationStatus, JobScheduleSource, JobStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { notifyGoogleIndexing, validateJobForGoogleIndexing } from "@/lib/google-indexing";
import { revalidatePublicSurfacesForJob } from "@/lib/public-revalidate";
import { getSiteUrl } from "@/lib/site-url";
import { parseScheduledAtInputToUtc } from "@/lib/scheduled-at-utc";
import { formatDateTimeLabelInTimeZone, SITE_TIME_ZONE } from "@/lib/timezone";

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
      scheduledPublishAt: null,
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
      scheduledPublishAt: null,
      publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
      scheduleSource: JobScheduleSource.MANUAL,
      importError: null
    }
  });
  return job;
}

const CRON_PUBLISH_LIMIT = 50;

function getDueScheduledWhere(now: Date): Prisma.JobWhereInput {
  return {
    publishedAt: null,
    scheduledPublishAt: { not: null, lte: now },
    OR: [{ status: JobStatus.SCHEDULED }, { publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO }]
  };
}

function getFutureScheduledWhere(now: Date): Prisma.JobWhereInput {
  return {
    publishedAt: null,
    scheduledPublishAt: { not: null, gt: now },
    OR: [{ status: JobStatus.SCHEDULED }, { publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO }]
  };
}

function getTotalScheduledWhere(): Prisma.JobWhereInput {
  return {
    publishedAt: null,
    scheduledPublishAt: { not: null },
    OR: [{ status: JobStatus.SCHEDULED }, { publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO }]
  };
}

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
  const now = new Date();
  const reconciled = await reconcilePublishedJobsPublicationStatus();
  const dueWhere = getDueScheduledWhere(now);
  const futureWhere = getFutureScheduledWhere(now);
  const totalWhere = getTotalScheduledWhere();

  const [totalScheduled, dueScheduled, futureScheduled, sampleScheduled] = await Promise.all([
    prisma.job.count({ where: totalWhere }),
    prisma.job.count({ where: dueWhere }),
    prisma.job.count({ where: futureWhere }),
    prisma.job.findMany({
      where: totalWhere,
      orderBy: [{ scheduledPublishAt: "asc" }, { createdAt: "asc" }],
      take: 10,
      select: { id: true, slug: true, scheduledPublishAt: true, status: true, publicationStatus: true }
    })
  ]);

  console.info("[cron publish-scheduled-jobs] diagnostics", {
    siteTimeZone: SITE_TIME_ZONE,
    nowUtcIso: now.toISOString(),
    nowSiteTime: formatDateTimeLabelInTimeZone(now),
    reconciledPublicationStatus: reconciled,
    totalScheduled,
    dueScheduled,
    futureScheduled,
    sample: sampleScheduled.map((job) => ({
      id: job.id,
      slug: job.slug,
      status: job.status,
      publicationStatus: job.publicationStatus,
      scheduledPublishAtUtc: job.scheduledPublishAt?.toISOString() ?? null,
      scheduledPublishAtSiteTime: job.scheduledPublishAt ? formatDateTimeLabelInTimeZone(job.scheduledPublishAt) : null
    }))
  });

  const due = await prisma.job.findMany({
    where: dueWhere,
    orderBy: [{ scheduledPublishAt: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: { id: true }
  });

  if (!due.length) {
    return {
      limit,
      published: 0,
      sentToIndexing: 0,
      dueScheduled,
      remainingScheduled: futureScheduled,
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
        scheduledPublishAt: null,
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
    where: getFutureScheduledWhere(new Date())
  });

  return {
    limit,
    published,
    sentToIndexing,
    dueScheduled,
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
            scheduledPublishAt: parsed,
            publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
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
