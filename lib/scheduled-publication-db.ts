import { mkdir, appendFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  AuditAction,
  EmploymentType,
  JobPublicationStatus,
  LocationType,
  type AdminRole,
  type City,
  type Company,
  type Job,
  type State
} from "@prisma/client";

import { normalizeLines, normalizeSlug, parseOptionalDate, richTextFromInput } from "@/lib/admin/content";
import { resolveCompanyByName, resolveStateAndCityFromNames } from "@/lib/admin/jobs";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { ensureLocationEnrichment } from "@/lib/location/location-enrichment-service";
import { notifyGoogleIndexing } from "@/lib/google-indexing";
import { appendPublicationAuditLog } from "@/lib/publication-audit-log";
import { parseScheduledAtInputToUtc } from "@/lib/scheduled-at-utc";
import type { ScheduledJobUploadRow } from "@/lib/schemas/scheduled-job-upload";
import { getSiteUrl } from "@/lib/site-url";
import {
  formatDateTimeKeyInTimeZone,
  formatDateTimeLabelInTimeZone,
  getNowInSiteTimeZone,
  SITE_TIME_ZONE
} from "@/lib/timezone";

type PublicationContext = {
  statesByInput: Map<string, State>;
  citiesByKey: Map<string, City>;
  companiesByKey: Map<string, Company>;
  jobsByExternalId: Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId" | "publicationStatus" | "isActive">>;
  jobsBySlug: Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId" | "publicationStatus" | "isActive">>;
  usedSlugs: Set<string>;
};

function normalizeKey(input: string) {
  return input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function cityKey(stateId: string, cityName: string) {
  return `${stateId}::${normalizeKey(cityName)}`;
}

function companyKey(companyName: string) {
  return normalizeKey(companyName);
}

function parseCurrencyValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }

  const normalized = String(value)
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function normalizeEmploymentType(value: unknown): EmploymentType {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (normalized && normalized in EmploymentType) {
    return normalized as EmploymentType;
  }

  return EmploymentType.APPRENTICESHIP;
}

function normalizeLocationType(value: unknown): LocationType {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (normalized && normalized in LocationType) {
    return normalized as LocationType;
  }

  return LocationType.ONSITE;
}

function buildSeoTitle(title: string, city: string, state: string) {
  return title || `Vaga de Jovem Aprendiz em ${city}/${state}`;
}

function buildSeoDescription(title: string, city: string, state: string) {
  return `${title || "Vaga de Jovem Aprendiz"}. Veja requisitos, beneficios e jornada em ${city}/${state}.`;
}

function buildSummary(title: string, city: string, state: string) {
  return title || `Jovem Aprendiz em ${city} ${state}`;
}

function ensureUniqueJobSlug(baseSlug: string, usedSlugs: Set<string>, currentSlug?: string) {
  const fallbackBase = baseSlug || `vaga-${Date.now()}`;

  if (currentSlug && currentSlug === fallbackBase) {
    usedSlugs.add(currentSlug);
    return currentSlug;
  }

  if (!usedSlugs.has(fallbackBase)) {
    usedSlugs.add(fallbackBase);
    return fallbackBase;
  }

  let suffix = 2;
  while (usedSlugs.has(`${fallbackBase}-${suffix}`)) {
    suffix += 1;
  }

  const nextSlug = `${fallbackBase}-${suffix}`;
  usedSlugs.add(nextSlug);
  return nextSlug;
}

async function createPublicationContext(rows: ScheduledJobUploadRow[]) {
  const externalIds = Array.from(new Set(rows.map((row) => row.externalId?.trim()).filter(Boolean))) as string[];
  const baseSlugs = Array.from(
    new Set(rows.map((row) => normalizeSlug(row.slug || row.title).trim()).filter(Boolean))
  );

  const existingJobs = await prisma.job.findMany({
    where: {
      OR: [
        ...(externalIds.length ? [{ externalId: { in: externalIds } }] : []),
        ...(baseSlugs.length ? baseSlugs.map((slug) => ({ slug: { startsWith: slug } })) : [])
      ]
    },
    select: {
      id: true,
      slug: true,
      publishedAt: true,
      externalId: true,
      publicationStatus: true,
      isActive: true
    }
  });

  const jobsByExternalId = new Map<
    string,
    Pick<Job, "id" | "slug" | "publishedAt" | "externalId" | "publicationStatus" | "isActive">
  >();
  const jobsBySlug = new Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId" | "publicationStatus" | "isActive">>();
  const usedSlugs = new Set<string>();

  for (const job of existingJobs) {
    jobsBySlug.set(job.slug, job);
    usedSlugs.add(job.slug);
    if (job.externalId) {
      jobsByExternalId.set(job.externalId, job);
    }
  }

  return {
    statesByInput: new Map<string, State>(),
    citiesByKey: new Map<string, City>(),
    companiesByKey: new Map<string, Company>(),
    jobsByExternalId,
    jobsBySlug,
    usedSlugs
  } satisfies PublicationContext;
}

async function resolveStateAndCityCached(context: PublicationContext, stateInput: string, cityInput: string) {
  const stateLookupKey = normalizeKey(stateInput);
  const cachedState = context.statesByInput.get(stateLookupKey);

  if (cachedState) {
    const cachedCity = context.citiesByKey.get(cityKey(cachedState.id, cityInput));
    if (cachedCity) {
      return { state: cachedState, city: cachedCity };
    }
  }

  const resolved = await resolveStateAndCityFromNames(stateInput, cityInput);
  context.statesByInput.set(normalizeKey(resolved.state.name), resolved.state);
  context.statesByInput.set(normalizeKey(resolved.state.code), resolved.state);
  context.citiesByKey.set(cityKey(resolved.state.id, resolved.city.name), resolved.city);
  context.citiesByKey.set(cityKey(resolved.state.id, resolved.city.slug), resolved.city);
  return resolved;
}

async function resolveCompanyCached(
  context: PublicationContext,
  input: {
    companyName: string;
    stateId: string;
    cityId: string;
    websiteUrl?: string | null;
    logoUrl?: string | null;
    summary?: string | null;
  }
) {
  const cacheKey = companyKey(input.companyName);
  const cached = context.companiesByKey.get(cacheKey);

  if (cached) {
    return cached;
  }

  const company = await resolveCompanyByName(input);
  context.companiesByKey.set(cacheKey, company);
  return company;
}

async function upsertScheduledDraftJob(row: ScheduledJobUploadRow, context: PublicationContext, scheduledUtc: Date) {
  const stateInput = row.stateName.trim();
  const cityInput = row.cityName.trim();
  const companyInput = row.companyName.trim();
  const title = row.title.trim();
  const externalId = row.externalId?.trim() || null;
  const summary = row.summary.trim() || buildSummary(title, cityInput, stateInput);
  const description = row.descriptionHtml.trim();
  const sourceUrl = row.sourceUrl?.trim() || row.applyUrl.trim();
  const slugBase = normalizeSlug(row.slug || row.title);

  const { state, city } = await resolveStateAndCityCached(context, stateInput, cityInput);
  const company = await resolveCompanyCached(context, {
    companyName: companyInput,
    stateId: state.id,
    cityId: city.id,
    websiteUrl: sourceUrl || null,
    summary: `Veja vagas de Jovem Aprendiz ligadas a ${companyInput}.`
  });

  const existingByExternalId = externalId ? context.jobsByExternalId.get(externalId) ?? null : null;
  const existingBySlug = context.jobsBySlug.get(slugBase) ?? null;
  const existing = existingByExternalId ?? (!externalId ? existingBySlug : null);
  const keepCurrentSlug = existingByExternalId?.slug ?? (!externalId ? existingBySlug?.slug : undefined);

  if (existing?.publicationStatus === JobPublicationStatus.OK && existing.isActive) {
    throw new Error("Esta vaga ja esta publicada (status OK). Use outro externalId ou slug para novo agendamento.");
  }

  const finalSlug = ensureUniqueJobSlug(slugBase, context.usedSlugs, keepCurrentSlug);

  const importStamp = new Date();

  const jobData = {
    title,
    slug: finalSlug,
    companyId: company.id,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary,
    descriptionHtml: richTextFromInput(description, { baseHeadingLevel: 2 }),
    requirements: normalizeLines(row.requirementsText),
    benefits: normalizeLines(row.benefitsText ?? ""),
    salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
    salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
    salaryCurrency: "BRL",
    employmentType: normalizeEmploymentType(row.employmentType),
    workHours: row.workHours?.trim() || null,
    expiresAt: parseOptionalDate(row.expiresAt),
    validThrough: parseOptionalDate(row.validThrough),
    applyUrl: row.applyUrl.trim(),
    isActive: false,
    sourceName: row.sourceName?.trim() || "Planilha agendada",
    sourceUrl: sourceUrl || null,
    locationType: normalizeLocationType(row.locationType),
    seoTitle: row.seoTitle.trim() || buildSeoTitle(title, city.name, state.code),
    seoDescription: row.seoDescription.trim() || buildSeoDescription(title, city.name, state.code),
    featured: row.featured,
    externalId,
    publishedAt: importStamp,
    stateId: state.id,
    cityId: city.id,
    scheduledPublishAt: scheduledUtc,
    publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
    googleIndexingStatus: null,
    googleIndexingMessage: null,
    googleIndexedAt: null,
    publishedPublicUrl: null
  };

  const job = externalId
    ? await prisma.job.upsert({
        where: { externalId },
        create: jobData,
        update: jobData
      })
    : await prisma.job.upsert({
        where: { slug: existing?.slug ?? finalSlug },
        create: jobData,
        update: jobData
      });

  context.jobsBySlug.set(job.slug, {
    id: job.id,
    slug: job.slug,
    publishedAt: job.publishedAt,
    externalId: job.externalId,
    publicationStatus: job.publicationStatus,
    isActive: job.isActive
  });

  if (job.externalId) {
    context.jobsByExternalId.set(job.externalId, {
      id: job.id,
      slug: job.slug,
      publishedAt: job.publishedAt,
      externalId: job.externalId,
      publicationStatus: job.publicationStatus,
      isActive: job.isActive
    });
  }

  try {
    await ensureLocationEnrichment({ companyName: company.name, city: city.name, state: state.code });
  } catch (error) {
    console.warn(`[location-enrichment] Falha no upload agendado (${company.name} / ${city.name}):`, error);
  }

  return job;
}

export type ScheduledUploadResult = {
  ok: boolean;
  imported: string[];
  errors: Array<{ line: number; message: string }>;
};

export async function importScheduledJobsFromUploadRows(
  rows: ScheduledJobUploadRow[],
  options?: {
    actorId?: string;
    actorName?: string;
    actorEmail?: string;
    actorRole?: AdminRole;
  }
): Promise<ScheduledUploadResult> {
  const context = await createPublicationContext(rows);
  const imported: string[] = [];
  const errors: Array<{ line: number; message: string }> = [];

  for (const [index, row] of rows.entries()) {
    const line = index + 2;
    try {
      const scheduledUtc = parseScheduledAtInputToUtc(row.scheduledAt);
      if (!scheduledUtc) {
        throw new Error(`Data/hora invalida em scheduledAt: "${String(row.scheduledAt)}". Use formato reconhecido (ex.: 21/04/2026 14:30 ou Excel).`);
      }

      const job = await upsertScheduledDraftJob(row, context, scheduledUtc);
      imported.push(job.slug);
      await appendPublicationAuditLog({
        phase: "upload",
        jobId: job.id,
        slug: job.slug,
        externalId: job.externalId,
        message: "Linha salva como AGUARDANDO_AGENDAMENTO (upload planilha)."
      });
    } catch (error) {
      errors.push({
        line,
        message: error instanceof Error ? error.message : "Erro ao salvar a linha."
      });
    }
  }

  await writeAuditLog({
    actorId: options?.actorId,
    actorName: options?.actorName,
    actorEmail: options?.actorEmail,
    actorRole: options?.actorRole,
    action: AuditAction.IMPORT,
    entityType: "scheduled-job-upload",
    summary: `Upload de planilha agendada: ${imported.length} vaga(s) em AGUARDANDO_AGENDAMENTO`,
    after: { imported, errorCount: errors.length, errors }
  });

  return {
    ok: errors.length === 0,
    imported,
    errors
  };
}

function getDefaultLogDir() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "scheduled-job-publication-logs");
  }

  return path.join(process.cwd(), "logs", "scheduled-job-publication");
}

type DbProcessSummary = {
  timeZone: string;
  processed: number;
  published: number;
  indexedOk: number;
  errors: number;
  logFilePath: string;
};

export type DbProcessResult = {
  ok: boolean;
  summary: DbProcessSummary;
  details: Array<{ jobId: string; slug: string; status: string; message: string }>;
};

export async function processScheduledPublicationsFromDatabase(options?: { logDir?: string }): Promise<DbProcessResult> {
  const now = getNowInSiteTimeZone();
  const logDir = options?.logDir || getDefaultLogDir();
  await mkdir(logDir, { recursive: true });
  const logFilePath = path.join(logDir, `${formatDateTimeKeyInTimeZone(now).slice(0, 10)}-db.jsonl`);

  const dueJobs = await prisma.job.findMany({
    where: {
      publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
      scheduledPublishAt: { not: null, lte: now }
    },
    select: {
      id: true,
      slug: true,
      title: true,
      scheduledPublishAt: true
    }
  });

  const details: DbProcessResult["details"] = [];
  let published = 0;
  let indexedOk = 0;
  let errors = 0;

  for (const due of dueJobs) {
    const line = JSON.stringify({
      jobId: due.id,
      slug: due.slug,
      title: due.title,
      scheduledPublishAt: due.scheduledPublishAt?.toISOString(),
      processedAt: formatDateTimeLabelInTimeZone(new Date()),
      timeZone: SITE_TIME_ZONE
    });

    try {
      await appendPublicationAuditLog({
        phase: "publish_attempt",
        jobId: due.id,
        slug: due.slug,
        message: "Inicio da publicacao agendada (DB)."
      });

      await prisma.job.update({
        where: { id: due.id },
        data: { publicationStatus: JobPublicationStatus.PUBLICANDO }
      });

      const publishedAt = new Date();

      const publishedUrl = getSiteUrl(`/vagas/${due.slug}`);
      if (!publishedUrl) {
        throw new Error("SITE_URL/NEXT_PUBLIC_SITE_URL nao configurado para montar URL publica.");
      }

      await prisma.job.update({
        where: { id: due.id },
        data: {
          isActive: true,
          publishedAt,
          publicationStatus: JobPublicationStatus.PUBLICADA,
          googleIndexingStatus: "INDEXANDO_GOOGLE",
          googleIndexingMessage: "",
          publishedPublicUrl: publishedUrl
        }
      });

      published += 1;

      const indexingResult = await notifyGoogleIndexing(publishedUrl);

      if (!indexingResult.ok) {
        await prisma.job.update({
          where: { id: due.id },
          data: {
            publicationStatus: JobPublicationStatus.ERRO,
            googleIndexingStatus: "ERRO",
            googleIndexingMessage: indexingResult.message
          }
        });
        errors += 1;
        details.push({ jobId: due.id, slug: due.slug, status: "ERRO", message: indexingResult.message });
        await appendFile(logFilePath, `${line}\n${JSON.stringify({ ok: false, message: indexingResult.message })}\n`, "utf-8");
        await appendPublicationAuditLog({
          phase: "publish_error",
          jobId: due.id,
          slug: due.slug,
          message: indexingResult.message,
          extra: { publishedUrl, source: "google_indexing" }
        });
        continue;
      }

      await prisma.job.update({
        where: { id: due.id },
        data: {
          publicationStatus: JobPublicationStatus.OK,
          googleIndexingStatus: "OK",
          googleIndexedAt: new Date(),
          googleIndexingMessage: indexingResult.message
        }
      });

      indexedOk += 1;
      details.push({ jobId: due.id, slug: due.slug, status: "OK", message: indexingResult.message });
      await appendFile(logFilePath, `${line}\n${JSON.stringify({ ok: true, message: indexingResult.message })}\n`, "utf-8");
      await appendPublicationAuditLog({
        phase: "publish_ok",
        jobId: due.id,
        slug: due.slug,
        message: indexingResult.message,
        extra: { publishedUrl }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha inesperada na publicacao.";
      errors += 1;
      await prisma.job.update({
        where: { id: due.id },
        data: {
          publicationStatus: JobPublicationStatus.ERRO,
          googleIndexingStatus: "ERRO",
          googleIndexingMessage: message
        }
      });
      details.push({ jobId: due.id, slug: due.slug, status: "ERRO", message });
      await appendFile(logFilePath, `${line}\n${JSON.stringify({ ok: false, message })}\n`, "utf-8");
      await appendPublicationAuditLog({
        phase: "publish_error",
        jobId: due.id,
        slug: due.slug,
        message,
        extra: { step: "exception" }
      });
    }
  }

  const summary: DbProcessSummary = {
    timeZone: SITE_TIME_ZONE,
    processed: dueJobs.length,
    published,
    indexedOk,
    errors,
    logFilePath
  };

  await writeAuditLog({
    action: AuditAction.UPDATE,
    entityType: "scheduled-job-publication-db",
    summary: `Publicacao agendada (DB): ${published} publicada(s), ${indexedOk} indexada(s), ${errors} erro(s)`,
    after: summary
  });

  return {
    ok: dueJobs.length === 0 || errors === 0,
    summary,
    details
  };
}
