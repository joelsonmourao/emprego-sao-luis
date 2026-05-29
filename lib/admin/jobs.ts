import { EmploymentType, JobIndexingStatus, JobPublicationStatus, JobScheduleSource, JobStatus, LocationType, Prisma } from "@prisma/client";

import { normalizeLines, normalizeSlug, parseOptionalDate, richTextFromInput, sanitizeHtml } from "@/lib/admin/content";
import { getBrazilNow, parseFlexibleDateToUtc } from "@/lib/date-utils";
import { prisma } from "@/lib/db";
import { ensureLocationEnrichment } from "@/lib/location/location-enrichment-service";
import { submitPublishedJobToIndexing } from "@/lib/job-publication";
import { parseScheduledAtInputToUtc } from "@/lib/scheduled-at-utc";
import { jobFormSchema, type JobFormValues } from "@/lib/schemas/job-form";

function processValidThrough(validThroughValue: string | undefined | null): Date | null {
  if (!validThroughValue || validThroughValue.trim() === "") {
    return null;
  }

  const trimmed = validThroughValue.trim();
  const parsed = parseFlexibleDateToUtc(trimmed);
  if (parsed) {
    return parsed;
  }

  const monthsToAdd = Number(trimmed);
  if (!Number.isNaN(monthsToAdd) && monthsToAdd > 0) {
    return getBrazilNow().add(monthsToAdd, "month").toDate();
  }

  return null;
}

function processValidThroughMonths(validThroughMonths: number | null | undefined): Date | null {
  if (!validThroughMonths || validThroughMonths < 1 || validThroughMonths > 24) {
    return null;
  }

  return getBrazilNow().add(validThroughMonths, "month").toDate();
}

export async function getStateAndCityBySlug(stateSlug: string, citySlug: string) {
  const state = await prisma.state.findUnique({
    where: { slug: stateSlug },
    include: {
      cities: {
        where: { slug: citySlug },
        take: 1
      }
    }
  });

  if (!state) {
    throw new Error("Estado nao encontrado.");
  }

  const city = state.cities[0];
  if (!city) {
    throw new Error("Cidade nao encontrada para o estado selecionado.");
  }

  return { state, city };
}

export async function resolveStateAndCityFromNames(stateInput: string, cityInput: string) {
  const normalizedState = normalizeSlug(stateInput);
  const normalizedCity = normalizeSlug(cityInput);

  const state = await prisma.state.findFirst({
    where: {
      OR: [{ slug: normalizedState }, { code: stateInput.toUpperCase() }, { name: { equals: stateInput, mode: "insensitive" } }]
    }
  });

  if (!state) {
    throw new Error(`Estado nao encontrado: ${stateInput}`);
  }

  const city =
    (await prisma.city.findFirst({
      where: {
        stateId: state.id,
        OR: [{ slug: normalizedCity }, { name: { equals: cityInput, mode: "insensitive" } }]
      }
    })) ??
    (await prisma.city.create({
      data: {
        name: cityInput.trim(),
        slug: normalizedCity,
        stateId: state.id
      }
    }));

  return { state, city };
}

export async function resolveCompany(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      city: true,
      state: true
    }
  });

  if (!company || !company.isActive) {
    throw new Error("Empresa nao encontrada ou inativa.");
  }

  return company;
}

export async function resolveCompanyByName(input: {
  companyName: string;
  stateId: string;
  cityId: string;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  summary?: string | null;
}) {
  const name = input.companyName.trim();
  const slug = normalizeSlug(name);

  const existing =
    (await prisma.company.findFirst({
      where: {
        OR: [{ slug }, { name: { equals: name, mode: "insensitive" } }]
      }
    })) ??
    (await prisma.company.create({
      data: {
        name,
        slug,
        logoUrl: input.logoUrl?.trim() || null,
        websiteUrl: input.websiteUrl?.trim() || null,
        summary: input.summary?.trim() || `Veja vagas de Jovem Aprendiz ligadas a ${name}.`,
        stateId: input.stateId,
        cityId: input.cityId,
        isActive: true
      }
    }));

  if (existing.stateId !== input.stateId || existing.cityId !== input.cityId || (input.websiteUrl && !existing.websiteUrl) || (input.logoUrl && !existing.logoUrl)) {
    return prisma.company.update({
      where: { id: existing.id },
      data: {
        stateId: input.stateId,
        cityId: input.cityId,
        websiteUrl: existing.websiteUrl || input.websiteUrl?.trim() || null,
        logoUrl: existing.logoUrl || input.logoUrl?.trim() || null
      }
    });
  }

  return existing;
}

export async function upsertJobFromForm(input: unknown, existingId?: string) {
  const parsed = jobFormSchema.parse(input);
  const company = await resolveCompany(parsed.companyId);
  const { state, city } = await getStateAndCityBySlug(parsed.stateSlug, parsed.citySlug);
  const existing = existingId
    ? await prisma.job.findUnique({
        where: { id: existingId },
        select: { id: true, publishedAt: true }
      })
    : null;

  const baseData = {
    title: parsed.title.trim(),
    slug: normalizeSlug(parsed.slug || parsed.title),
    companyId: company.id,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    heroImageUrl: parsed.heroImageUrl?.trim() || null,
    summary: parsed.summary.trim(),
    descriptionHtml: richTextFromInput(parsed.descriptionHtml, { baseHeadingLevel: 2 }),
    requirements: normalizeLines(parsed.requirementsText),
    benefits: normalizeLines(parsed.benefitsText ?? ""),
    salaryMin: parsed.salaryMin ?? null,
    salaryMax: parsed.salaryMax ?? null,
    employmentType: parsed.employmentType as EmploymentType,
    workHours: parsed.workHours?.trim() || null,
    expiresAt: parseOptionalDate(parsed.expiresAt),
    validThrough: processValidThroughMonths(parsed.validThroughMonths) ?? processValidThrough(parsed.validThrough),
    applyUrl: parsed.applyUrl,
    isActive: parsed.isActive,
    locationType: parsed.locationType as LocationType,
    seoTitle: parsed.seoTitle.trim(),
    seoDescription: parsed.seoDescription.trim(),
    featured: parsed.featured,
    stateId: state.id,
    cityId: city.id,
    autoSubmitToIndexing: parsed.autoSubmitToIndexing
  } satisfies Omit<Prisma.JobUncheckedCreateInput, "publishedAt">;

  const scheduledAt = parseScheduledAtInputToUtc(parsed.scheduledAt);
  if (parsed.status === "SCHEDULED" && !scheduledAt) {
    throw new Error("Data/hora de publicacao invalida. Use dd/MM/yyyy HH:mm.");
  }

  const publicationFields = {
    status: parsed.status as JobStatus,
    publicationStatus:
      parsed.status === "PUBLISHED"
        ? JobPublicationStatus.OK
        : parsed.status === "SCHEDULED"
          ? JobPublicationStatus.AGUARDANDO_AGENDAMENTO
          : JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
    isActive: parsed.status === "PUBLISHED" ? true : parsed.isActive,
    scheduledAt: parsed.status === "SCHEDULED" ? scheduledAt : null,
    scheduledPublishAt: parsed.status === "SCHEDULED" ? scheduledAt : null,
    scheduleSource: parsed.status === "SCHEDULED" ? JobScheduleSource.ADMIN : JobScheduleSource.MANUAL,
    publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
    indexingStatus: parsed.status === "PUBLISHED" ? JobIndexingStatus.NOT_SENT : JobIndexingStatus.SKIPPED,
    indexingError: null
  } satisfies Prisma.JobUncheckedUpdateInput;

  const jobPublicSelect = {
    id: true,
    slug: true,
    title: true,
    isActive: true,
    employmentType: true,
    state: { select: { slug: true } },
    city: { select: { slug: true } },
    company: { select: { slug: true } }
  } satisfies Prisma.JobSelect;

  if (existingId) {
    if (!existing) {
      throw new Error("Vaga nao encontrada.");
    }

    const saved = await prisma.job.update({
      where: { id: existingId },
      data: {
        ...baseData,
        ...publicationFields
      },
      select: jobPublicSelect
    });
    await enrichJobLocationQuietly(company.name, city.name, state.code);
    if (parsed.status === "PUBLISHED" && parsed.autoSubmitToIndexing) {
      await submitPublishedJobToIndexing(saved.id);
    }
    return saved;
  }

  const createData: Prisma.JobUncheckedCreateInput = {
    ...baseData,
    ...publicationFields
  };

  const saved = await prisma.job.create({
    data: createData,
    select: jobPublicSelect
  });
  await enrichJobLocationQuietly(company.name, city.name, state.code);
  if (parsed.status === "PUBLISHED" && parsed.autoSubmitToIndexing) {
    await submitPublishedJobToIndexing(saved.id);
  }
  return saved;
}

async function enrichJobLocationQuietly(companyName: string, city: string, state: string) {
  try {
    await ensureLocationEnrichment({ companyName, city, state });
  } catch (error) {
    console.warn(`[location-enrichment] Falha ao enriquecer localização no admin (${companyName} / ${city} / ${state}):`, error);
  }
}

export type AdminImportJobInput = JobFormValues & {
  publishedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
  externalId?: string;
};

export async function deleteJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      slug: true,
      employmentType: true,
      state: { select: { slug: true } },
      city: { select: { slug: true } },
      company: { select: { slug: true } }
    }
  });

  if (!job) {
    throw new Error("Vaga nao encontrada.");
  }

  await prisma.job.delete({
    where: { id: jobId }
  });

  return {
    ...job,
    summary: {
      jobsDeleted: 1,
      companiesDeleted: 0,
      citiesDeleted: 0,
      statesDeleted: 0,
      hubProfilesDeleted: 0
    }
  };
}

export async function bulkDeleteJobs(jobIds: string[]) {
  const uniqueIds = [...new Set(jobIds.filter(Boolean))];
  const results: Array<{
    id: string;
    title?: string | null;
    deleted: boolean;
    error?: string;
    summary?: {
      jobsDeleted: number;
      companiesDeleted: number;
      citiesDeleted: number;
      statesDeleted: number;
      hubProfilesDeleted: number;
    };
  }> = [];

  for (const id of uniqueIds) {
    try {
      const job = await deleteJob(id);
      results.push({
        id,
        title: job.title,
        deleted: true,
        summary: job.summary
      });
    } catch (error) {
      results.push({
        id,
        deleted: false,
        error: error instanceof Error ? error.message : "Nao foi possivel excluir a vaga."
      });
    }
  }

  return results;
}
