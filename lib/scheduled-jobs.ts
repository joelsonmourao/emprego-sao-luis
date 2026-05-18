import { existsSync } from "node:fs";
import { mkdir, appendFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { AuditAction, EmploymentType, LocationType, type City, type Company, type Job, type State } from "@prisma/client";
import XLSX from "xlsx";

import { parseSpreadsheetEmploymentType } from "@/lib/jobs/employment-type";
import { markExpiredJobsInactive } from "@/lib/jobs/job-expiry";
import { writeAuditLog } from "@/lib/audit";
import { normalizeLines, normalizeSlug, parseOptionalDate, richTextFromInput } from "@/lib/admin/content";
import { resolveCompanyByName, resolveStateAndCityFromNames } from "@/lib/admin/jobs";
import { prisma } from "@/lib/db";
import { ensureLocationEnrichment } from "@/lib/location/location-enrichment-service";
import { env } from "@/lib/env";
import { notifyGoogleIndexing } from "@/lib/google-indexing";
import { getSiteUrl } from "@/lib/site-url";
import {
  SITE_TIME_ZONE,
  compareDateTimeKeys,
  formatDateTimeKeyInTimeZone,
  formatDateTimeLabelInTimeZone,
  getNowInSiteTimeZone,
  normalizeScheduledAtValue,
  toWorkbookDateTimeValue
} from "@/lib/timezone";

const REQUIRED_COLUMNS = [
  "scheduledAt",
  "publishStatus",
  "publishedUrl",
  "publishedAt",
  "googleIndexingStatus",
  "googleIndexedAt",
  "googleIndexingMessage"
] as const;

const PUBLISH_STATUS = {
  WAITING: "AGUARDANDO_AGENDAMENTO",
  SCHEDULED: "AGENDADA",
  PUBLISHING: "PUBLICANDO",
  PUBLISHED: "PUBLICADA",
  INDEXING: "INDEXANDO_GOOGLE",
  OK: "OK",
  ERROR: "ERRO"
} as const;

const GOOGLE_STATUS = {
  WAITING: "AGUARDANDO_PUBLICACAO",
  INDEXING: "INDEXANDO_GOOGLE",
  OK: "OK",
  ERROR: "ERRO"
} as const;

type PublishStatus = (typeof PUBLISH_STATUS)[keyof typeof PUBLISH_STATUS];
type GoogleStatus = (typeof GOOGLE_STATUS)[keyof typeof GOOGLE_STATUS];

type SpreadsheetRow = Record<string, unknown>;

type ScheduledRow = SpreadsheetRow & {
  __rowNumber: number;
};

type ProcessLogEntry = {
  rowNumber: number;
  externalId: string;
  title: string;
  status: string;
  scheduledAt: string;
  publishedUrl?: string;
  message: string;
  timeZone: string;
  processedAt: string;
};

type ProcessSummary = {
  workbookPath: string;
  sheetName: string;
  timeZone: string;
  totalRows: number;
  dueRows: number;
  publishedCount: number;
  indexedCount: number;
  skippedCount: number;
  errorCount: number;
  logFilePath: string;
};

type ProcessResult = {
  ok: boolean;
  summary: ProcessSummary;
  results: Array<ProcessLogEntry>;
};

const DEFAULT_WORKBOOK_NAMES = ["vagas.xlsx", "modelo_importacao_vagas.xlsx", "Vagas.xlsx"] as const;

export function resolveScheduledWorkbookPath(): string | null {
  const configured = env.SCHEDULED_JOBS_SPREADSHEET_PATH?.trim();
  if (configured) {
    return configured;
  }

  const root = process.cwd();
  for (const name of DEFAULT_WORKBOOK_NAMES) {
    const fullPath = path.join(root, name);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

type PublicationContext = {
  statesByInput: Map<string, State>;
  citiesByKey: Map<string, City>;
  companiesByKey: Map<string, Company>;
  jobsByExternalId: Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>;
  jobsBySlug: Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>;
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

function normalizeLocationType(value: unknown): LocationType {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (normalized && normalized in LocationType) {
    return normalized as LocationType;
  }

  return LocationType.ONSITE;
}

function normalizeCellString(value: unknown) {
  return String(value ?? "").trim();
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

function createLogLine(entry: ProcessLogEntry) {
  return JSON.stringify(entry);
}

function getDefaultLogDir() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "scheduled-job-publication-logs");
  }

  return path.join(process.cwd(), "logs", "scheduled-job-publication");
}

function normalizePublishStatus(value: unknown): PublishStatus {
  const normalized = normalizeCellString(value).toUpperCase();

  if (Object.values(PUBLISH_STATUS).includes(normalized as PublishStatus)) {
    return normalized as PublishStatus;
  }

  return PUBLISH_STATUS.WAITING;
}

function normalizeGoogleStatus(value: unknown): GoogleStatus {
  const normalized = normalizeCellString(value).toUpperCase();

  if (Object.values(GOOGLE_STATUS).includes(normalized as GoogleStatus)) {
    return normalized as GoogleStatus;
  }

  return GOOGLE_STATUS.WAITING;
}

function isTerminalStatus(status: PublishStatus) {
  return status === PUBLISH_STATUS.OK;
}

function shouldSkipRow(row: ScheduledRow) {
  const title = normalizeCellString(row.title);
  const applyUrl = normalizeCellString(row.applyUrl);
  return !title || !applyUrl;
}

async function createPublicationContext(rows: ScheduledRow[]) {
  const externalIds = Array.from(
    new Set(rows.map((row) => normalizeCellString(row.externalId)).filter(Boolean))
  );
  const baseSlugs = Array.from(
    new Set(rows.map((row) => normalizeSlug(normalizeCellString(row.slug) || normalizeCellString(row.title))).filter(Boolean))
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
      externalId: true
    }
  });

  const jobsByExternalId = new Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>();
  const jobsBySlug = new Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>();
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

async function upsertScheduledJob(row: ScheduledRow, context: PublicationContext, publishedAt: Date) {
  const stateInput = normalizeCellString(row.state);
  const cityInput = normalizeCellString(row.city);
  const companyInput = normalizeCellString(row.company);
  const title = normalizeCellString(row.title);
  const externalId = normalizeCellString(row.externalId) || null;
  const summary = normalizeCellString(row.summary) || buildSummary(title, cityInput, stateInput);
  const description = normalizeCellString(row.description);
  const sourceUrl = normalizeCellString(row.sourceUrl) || normalizeCellString(row.applyUrl);
  const slugBase = normalizeSlug(normalizeCellString(row.slug) || title);

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
  const finalSlug = ensureUniqueJobSlug(slugBase, context.usedSlugs, keepCurrentSlug);

  const jobData = {
    title,
    slug: finalSlug,
    companyId: company.id,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary,
    descriptionHtml: richTextFromInput(description, { baseHeadingLevel: 2 }),
    requirements: normalizeLines(normalizeCellString(row.requirements)),
    benefits: normalizeLines(normalizeCellString(row.benefits)),
    salaryMin: parseCurrencyValue(row.salaryMin),
    salaryMax: parseCurrencyValue(row.salaryMax),
    salaryCurrency: "BRL",
    employmentType: parseSpreadsheetEmploymentType(row.employmentType),
    workHours: normalizeCellString(row.workHours) || null,
    expiresAt: parseOptionalDate(normalizeCellString(row.expiresAt)),
    validThrough: parseOptionalDate(normalizeCellString(row.validThrough)),
    applyUrl: normalizeCellString(row.applyUrl),
    isActive: true,
    sourceName: "Indeed",
    sourceUrl: sourceUrl || null,
    locationType: normalizeLocationType(row.locationType),
    seoTitle: normalizeCellString(row.seoTitle) || buildSeoTitle(title, city.name, state.code),
    seoDescription: normalizeCellString(row.seoDescription) || buildSeoDescription(title, city.name, state.code),
    featured: false,
    externalId,
    publishedAt: existing?.publishedAt ?? publishedAt,
    stateId: state.id,
    cityId: city.id
  };

  const job =
    externalId
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
    externalId: job.externalId
  });

  if (job.externalId) {
    context.jobsByExternalId.set(job.externalId, {
      id: job.id,
      slug: job.slug,
      publishedAt: job.publishedAt,
      externalId: job.externalId
    });
  }

  try {
    await ensureLocationEnrichment({ companyName: company.name, city: city.name, state: state.code });
  } catch (error) {
    console.warn(`[location-enrichment] Falha na publicação agendada (${company.name} / ${city.name}):`, error);
  }

  return job;
}

function ensureRequiredColumns(headers: string[]) {
  const nextHeaders = [...headers];

  for (const column of REQUIRED_COLUMNS) {
    if (!nextHeaders.includes(column)) {
      nextHeaders.push(column);
    }
  }

  return nextHeaders;
}

function readWorksheetRows(workbookPath: string, preferredSheetName?: string) {
  const workbook = XLSX.readFile(workbookPath, {
    cellDates: false
  });
  const sheetName = preferredSheetName && workbook.SheetNames.includes(preferredSheetName) ? preferredSheetName : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rowsAsArrays = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null)[]>(worksheet, {
    header: 1,
    defval: "",
    raw: false
  });

  const headers = ensureRequiredColumns(
    (rowsAsArrays[0] ?? []).map((header) => normalizeCellString(header))
  );
  const dataRows = rowsAsArrays.slice(1).map((values, index) => {
    const row = headers.reduce<ScheduledRow>((acc, header, columnIndex) => {
      acc[header] = values[columnIndex] ?? "";
      return acc;
    }, { __rowNumber: index + 2 });

    return row;
  });

  return { workbook, sheetName, headers, rows: dataRows };
}

async function appendProcessLog(logDir: string, entry: ProcessLogEntry) {
  await mkdir(logDir, { recursive: true });
  const filePath = path.join(logDir, `${formatDateTimeKeyInTimeZone(new Date()).slice(0, 10)}.jsonl`);
  await appendFile(filePath, `${createLogLine(entry)}\n`, "utf-8");
  return filePath;
}

function buildWorkbookRows(headers: string[], rows: ScheduledRow[]) {
  return [
    headers,
    ...rows.map((row) => headers.map((header) => (row[header] ?? "")))
  ];
}

function updateRowStatuses(row: ScheduledRow, updates: Partial<ScheduledRow>) {
  Object.assign(row, updates);
}

export async function processScheduledJobsWorkbook(options?: {
  workbookPath?: string;
  sheetName?: string;
  logDir?: string;
}) {
  const workbookPath = options?.workbookPath ?? resolveScheduledWorkbookPath();
  if (!workbookPath) {
    throw new Error(
      "Planilha nao encontrada. Defina SCHEDULED_JOBS_SPREADSHEET_PATH, passe --file na execucao, ou coloque vagas.xlsx (ou modelo_importacao_vagas.xlsx) na raiz do projeto."
    );
  }

  const { workbook, sheetName, headers, rows } = readWorksheetRows(workbookPath, options?.sheetName || env.SCHEDULED_JOBS_SHEET_NAME);
  const now = getNowInSiteTimeZone();
  const nowKey = formatDateTimeKeyInTimeZone(now);
  const logDir = options?.logDir || env.SCHEDULED_JOBS_LOG_DIR || getDefaultLogDir();
  const context = await createPublicationContext(rows);
  const results: ProcessLogEntry[] = [];

  let publishedCount = 0;
  let indexedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let dueRows = 0;
  let logFilePath = path.join(logDir, `${formatDateTimeKeyInTimeZone(now).slice(0, 10)}.jsonl`);

  for (const row of rows) {
    if (shouldSkipRow(row)) {
      skippedCount += 1;
      continue;
    }

    const scheduledAtKey = normalizeScheduledAtValue(row.scheduledAt);
    const currentPublishStatus = normalizePublishStatus(row.publishStatus);
    const currentGoogleStatus = normalizeGoogleStatus(row.googleIndexingStatus);

    if (!scheduledAtKey) {
      updateRowStatuses(row, {
        publishStatus: PUBLISH_STATUS.WAITING,
        googleIndexingStatus: currentGoogleStatus === GOOGLE_STATUS.OK ? currentGoogleStatus : GOOGLE_STATUS.WAITING,
        googleIndexingMessage: normalizeCellString(row.googleIndexingMessage)
      });
      skippedCount += 1;
      continue;
    }

    if (compareDateTimeKeys(scheduledAtKey, nowKey) > 0) {
      updateRowStatuses(row, {
        publishStatus: isTerminalStatus(currentPublishStatus) ? currentPublishStatus : PUBLISH_STATUS.SCHEDULED,
        scheduledAt: toWorkbookDateTimeValue(scheduledAtKey)
      });
      skippedCount += 1;
      continue;
    }

    if (isTerminalStatus(currentPublishStatus) && currentGoogleStatus === GOOGLE_STATUS.OK) {
      skippedCount += 1;
      continue;
    }

    dueRows += 1;

    try {
      updateRowStatuses(row, {
        publishStatus: PUBLISH_STATUS.PUBLISHING,
        scheduledAt: toWorkbookDateTimeValue(scheduledAtKey),
        googleIndexingMessage: ""
      });

      const publishedAt = new Date();
      const job = await upsertScheduledJob(row, context, publishedAt);
      const publishedUrl = getSiteUrl(`/vagas/${job.slug}`);

      updateRowStatuses(row, {
        publishStatus: PUBLISH_STATUS.PUBLISHED,
        publishedUrl,
        publishedAt: toWorkbookDateTimeValue(publishedAt),
        googleIndexingStatus: GOOGLE_STATUS.INDEXING
      });

      publishedCount += 1;

      if (!publishedUrl) {
        throw new Error("A vaga foi publicada, mas a URL final do dominio nao foi gerada. O envio ao Google foi cancelado.");
      }

      const indexingResult = await notifyGoogleIndexing(publishedUrl);

      if (!indexingResult.ok) {
        updateRowStatuses(row, {
          publishStatus: PUBLISH_STATUS.ERROR,
          googleIndexingStatus: GOOGLE_STATUS.ERROR,
          googleIndexingMessage: indexingResult.message
        });
        errorCount += 1;

        const entry: ProcessLogEntry = {
          rowNumber: row.__rowNumber,
          externalId: normalizeCellString(row.externalId),
          title: normalizeCellString(row.title),
          status: PUBLISH_STATUS.ERROR,
          scheduledAt: scheduledAtKey,
          publishedUrl,
          message: indexingResult.message,
          timeZone: SITE_TIME_ZONE,
          processedAt: formatDateTimeLabelInTimeZone(new Date())
        };

        logFilePath = await appendProcessLog(logDir, entry);
        results.push(entry);
        continue;
      }

      updateRowStatuses(row, {
        publishStatus: PUBLISH_STATUS.OK,
        googleIndexingStatus: GOOGLE_STATUS.OK,
        googleIndexedAt: toWorkbookDateTimeValue(new Date()),
        googleIndexingMessage: indexingResult.message
      });

      indexedCount += 1;

      const entry: ProcessLogEntry = {
        rowNumber: row.__rowNumber,
        externalId: normalizeCellString(row.externalId),
        title: normalizeCellString(row.title),
        status: PUBLISH_STATUS.OK,
        scheduledAt: scheduledAtKey,
        publishedUrl,
        message: indexingResult.message,
        timeZone: SITE_TIME_ZONE,
        processedAt: formatDateTimeLabelInTimeZone(new Date())
      };

      logFilePath = await appendProcessLog(logDir, entry);
      results.push(entry);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha inesperada ao publicar a vaga agendada.";

      updateRowStatuses(row, {
        publishStatus: PUBLISH_STATUS.ERROR,
        googleIndexingStatus: GOOGLE_STATUS.ERROR,
        googleIndexingMessage: message
      });

      errorCount += 1;

      const entry: ProcessLogEntry = {
        rowNumber: row.__rowNumber,
        externalId: normalizeCellString(row.externalId),
        title: normalizeCellString(row.title),
        status: PUBLISH_STATUS.ERROR,
        scheduledAt: scheduledAtKey,
        publishedUrl: normalizeCellString(row.publishedUrl),
        message,
        timeZone: SITE_TIME_ZONE,
        processedAt: formatDateTimeLabelInTimeZone(new Date())
      };

      logFilePath = await appendProcessLog(logDir, entry);
      results.push(entry);
    }
  }

  workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(buildWorkbookRows(headers, rows));
  XLSX.writeFile(workbook, workbookPath);

  const summary: ProcessSummary = {
    workbookPath,
    sheetName,
    timeZone: SITE_TIME_ZONE,
    totalRows: rows.length,
    dueRows,
    publishedCount,
    indexedCount,
    skippedCount,
    errorCount,
    logFilePath
  };

  await markExpiredJobsInactive();

  await writeAuditLog({
    action: AuditAction.UPDATE,
    entityType: "scheduled-job-publication",
    summary: `Processamento de publicacao agendada executado em ${SITE_TIME_ZONE}`,
    after: {
      ...summary,
      results
    }
  });

  return {
    ok: errorCount === 0,
    summary,
    results
  } satisfies ProcessResult;
}
