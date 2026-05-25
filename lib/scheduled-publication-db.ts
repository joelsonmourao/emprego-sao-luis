import { mkdir, appendFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  AuditAction,
  EmploymentType,
  JobIndexingStatus,
  JobPublicationStatus,
  JobScheduleSource,
  JobStatus,
  LocationType,
  type AdminRole,
  type City,
  type Company,
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
  usedSlugs: Set<string>;
  usedExternalIds: Set<string>;
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

function buildInternalExternalId() {
  return `sheet-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function ensureUniqueExternalId(rawExternalId: string | null, usedExternalIds: Set<string>) {
  const base = rawExternalId?.trim() || buildInternalExternalId();

  if (!usedExternalIds.has(base)) {
    usedExternalIds.add(base);
    return base;
  }

  let suffix = 2;
  while (usedExternalIds.has(`${base}-${suffix}`)) {
    suffix += 1;
  }

  const next = `${base}-${suffix}`;
  usedExternalIds.add(next);
  return next;
}

async function createPublicationContext(rows: ScheduledJobUploadRow[]) {
  const externalIds = Array.from(new Set(rows.map((row) => row.externalId?.trim()).filter(Boolean))) as string[];
  const baseSlugs = Array.from(
    new Set(rows.map((row) => normalizeSlug(row.slug || row.title || row.seoTitle).trim()).filter(Boolean))
  );

  const usedSlugs = new Set<string>();
  const usedExternalIds = new Set<string>();

  if (baseSlugs.length) {
    const existingBySlug = await prisma.job.findMany({
      where: { OR: baseSlugs.map((slug) => ({ slug: { startsWith: slug } })) },
      select: { slug: true }
    });
    for (const job of existingBySlug) {
      usedSlugs.add(job.slug);
    }
  }

  if (externalIds.length) {
    const existingByExternalId = await prisma.job.findMany({
      where: { externalId: { in: externalIds } },
      select: { externalId: true }
    });
    for (const job of existingByExternalId) {
      if (job.externalId) {
        usedExternalIds.add(job.externalId);
      }
    }
  }

  return {
    statesByInput: new Map<string, State>(),
    citiesByKey: new Map<string, City>(),
    companiesByKey: new Map<string, Company>(),
    usedSlugs,
    usedExternalIds
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

function resolveScheduledImportStatus(value: unknown) {
  const rawValue = value === null || value === undefined ? "" : String(value).trim();
  if (!rawValue) {
    return {
      status: JobStatus.DRAFT,
      scheduledAt: null as Date | null,
      importError: null as string | null,
      publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO
    };
  }

  const scheduledUtc = parseScheduledAtInputToUtc(value);
  if (!scheduledUtc) {
    return {
      status: JobStatus.ERROR,
      scheduledAt: null as Date | null,
      importError: "Formato invalido em dataHoraPublicacao. Use dd/MM/yyyy HH:mm.",
      publicationStatus: JobPublicationStatus.ERRO
    };
  }

  if (scheduledUtc.getTime() <= Date.now()) {
    return {
      status: JobStatus.ERROR,
      scheduledAt: null as Date | null,
      importError: "Data/hora de publicacao esta no passado. Ajuste dataHoraPublicacao ou use Publicar agora.",
      publicationStatus: JobPublicationStatus.ERRO
    };
  }

  return {
    status: JobStatus.SCHEDULED,
    scheduledAt: scheduledUtc,
    importError: null as string | null,
    publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO
  };
}

async function findCompanyNameFallback() {
  const existing = await prisma.company.findFirst({
    select: { name: true },
    orderBy: { createdAt: "asc" }
  });

  return existing?.name || "Empresa nao informada";
}

function buildCompanySummary(companyName: string) {
  return `Veja vagas de Jovem Aprendiz ligadas a ${companyName}.`;
}

function resolveSafeTitle(row: ScheduledJobUploadRow) {
  const fromTitle = row.title.trim();
  if (fromTitle) return fromTitle;
  return row.seoTitle.trim();
}

function resolveSafeCompanyName(row: ScheduledJobUploadRow, fallback: string) {
  const fromRow = row.companyName.trim();
  return fromRow || fallback;
}

function normalizeScheduledImportRawValue(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text || null;
}

async function upsertScheduledDraftJob(row: ScheduledJobUploadRow, context: PublicationContext, companyNameFallback: string) {
  const stateInput = row.stateName.trim();
  const cityInput = row.cityName.trim();
  const title = resolveSafeTitle(row);
  const companyInput = resolveSafeCompanyName(row, companyNameFallback);
  const externalId = ensureUniqueExternalId(row.externalId?.trim() || null, context.usedExternalIds);
  const summary = row.summary.trim() || buildSummary(title, cityInput, stateInput);
  const description = row.descriptionHtml.trim();
  const sourceUrl = row.sourceUrl?.trim() || row.applyUrl.trim();
  const slugBase = normalizeSlug(row.slug || row.title || row.seoTitle);
  const importDecision = resolveScheduledImportStatus(row.dataHoraPublicacao);

  const { state, city } = await resolveStateAndCityCached(context, stateInput, cityInput);
  const company = await resolveCompanyCached(context, {
    companyName: companyInput,
    stateId: state.id,
    cityId: city.id,
    websiteUrl: sourceUrl || null,
    summary: buildCompanySummary(companyInput)
  });

  const finalSlug = ensureUniqueJobSlug(slugBase, context.usedSlugs);
  const seoTitle = row.seoTitle.trim() || title;
  const seoDescription = row.seoDescription.trim() || buildSeoDescription(title, city.name, state.code);

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
    seoTitle,
    seoDescription,
    featured: row.featured,
    externalId,
    publishedAt: null,
    stateId: state.id,
    cityId: city.id,
    scheduledPublishAt: importDecision.scheduledAt,
    publicationStatus: importDecision.publicationStatus,
    googleIndexingStatus: null,
    googleIndexingMessage: null,
    googleIndexedAt: null,
    publishedPublicUrl: null,
    status: importDecision.status,
    scheduledAt: importDecision.scheduledAt,
    scheduleSource: JobScheduleSource.PLANILHA,
    scheduledImportRawValue: normalizeScheduledImportRawValue(row.dataHoraPublicacao),
    importError: importDecision.importError,
    indexingStatus: importDecision.status === JobStatus.ERROR ? JobIndexingStatus.SKIPPED : JobIndexingStatus.NOT_SENT,
    indexingError: importDecision.importError,
    indexingLastSubmittedAt: null
  };

  const job = await prisma.job.create({ data: jobData });

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
  const companyNameFallback = await findCompanyNameFallback();
  const imported: string[] = [];
  const errors: Array<{ line: number; message: string }> = [];

  for (const [index, row] of rows.entries()) {
    const line = index + 2;
    try {
      const job = await upsertScheduledDraftJob(row, context, companyNameFallback);
      imported.push(job.slug);
      if (job.status === JobStatus.ERROR) {
        errors.push({
          line,
          message: job.importError ?? "Erro ao interpretar dataHoraPublicacao."
        });
      }
      await appendPublicationAuditLog({
        phase: "upload",
        jobId: job.id,
        slug: job.slug,
        externalId: job.externalId,
        message: `Linha importada com status ${job.status} (upload planilha com dataHoraPublicacao).`,
        extra: {
          status: job.status,
          scheduledAt: job.scheduledAt,
          importError: job.importError
        }
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
