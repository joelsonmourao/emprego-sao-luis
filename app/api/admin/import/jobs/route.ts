import { AuditAction, ImportQueueStatus, Prisma, type City, type Company, type State } from "@prisma/client";
import { NextResponse } from "next/server";

import { normalizeSlug, parseOptionalDate, richTextFromInput, sanitizeText } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import {
  countSchemaTitlePollutedForSlugs,
  emptyImportSummaryReport,
  finalizeImportReport,
  formatImportReportMessage,
  type JobImportSummaryReport
} from "@/lib/jobs/import-report";
import { markExpiredJobsInactive } from "@/lib/jobs/job-expiry";
import {
  buildImportJobLookup,
  buildJobCreateData,
  buildJobUpdateData,
  buildNewJobSlugBase,
  findExistingJobSnapshot,
  registerSnapshotInLookup,
  snapshotFromPersisted,
  type JobImportSnapshot
} from "@/lib/jobs/spreadsheet-import-merge";
import { revalidatePublicSurfacesAfterBulkJobChange } from "@/lib/public-revalidate";
import { importJobsPayloadSchema, type ImportedJobRow } from "@/lib/schemas/job-import";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
const RESPONSE_HEADERS = {
  "Cache-Control": "no-store"
};

const DIRECT_IMPORT_LIMIT = 100;
const AI_TIMEOUT_MS = 12000;
const CLAUDE_DESCRIPTION_MODEL = "claude-haiku-4-5-20251001";
const BRAZILIAN_UFS = new Set([
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO"
]);
const INVALID_AREA_VALUES = ["caxias", "sao paulo", "rio de janeiro", "fortaleza", "salvador", "curitiba", "belo horizonte", "brasil", "br"];

type ImportIssue = {
  line: number;
  title: string;
  message: string;
};

type ImportContext = {
  statesByName: Map<string, State>;
  statesByCode: Map<string, State>;
  citiesByStateAndName: Map<string, City>;
  citiesByStateAndSlug: Map<string, City>;
  companiesBySlug: Map<string, Company>;
  companiesByName: Map<string, Company>;
  jobLookup: ReturnType<typeof buildImportJobLookup>;
  issues: ImportIssue[];
  imported: string[];
  updated: string[];
  processedRows: number;
  summary: JobImportSummaryReport;
  touchedSlugs: string[];
};

export const maxDuration = 60;

function normalizeKey(input: string) {
  return input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeBrazilianUf(value: string | null | undefined) {
  const uf = String(value ?? "").trim().toUpperCase();
  return BRAZILIAN_UFS.has(uf) ? uf : null;
}

function ensureImportedSummary(row: ImportedJobRow) {
  const fromSummary = sanitizeText(row.summary).replace(/\s+/g, " ").trim();
  if (fromSummary.length >= 20) return fromSummary.slice(0, 220);

  const fromDescription = sanitizeText(row.descriptionHtml)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (fromDescription.length >= 20) return fromDescription.slice(0, 220);

  return `Vaga de ${sanitizeText(row.title)} na ${sanitizeText(row.companyName)} em ${sanitizeText(row.cityName)}, ${sanitizeText(row.stateName)}.`;
}

function sanitizeArea(value: string | null | undefined) {
  const area = sanitizeText(value);
  const normalized = normalizeKey(area);

  if (!area || INVALID_AREA_VALUES.some((invalid) => normalized.includes(invalid))) {
    return "Administrativo";
  }

  return area;
}

function sanitizeImportedRow(row: ImportedJobRow): ImportedJobRow {
  return {
    ...row,
    title: sanitizeText(row.title),
    descriptionHtml: sanitizeText(row.descriptionHtml),
    summary: ensureImportedSummary(row),
    requirementsText: sanitizeText(row.requirementsText ?? ""),
    benefitsText: sanitizeText(row.benefitsText ?? ""),
    area: sanitizeArea(row.area),
    stateName: normalizeBrazilianUf(row.stateName) ?? ""
  };
}

async function generateUniqueDescriptionWithClaude(row: ImportedJobRow) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return row.descriptionHtml;
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: CLAUDE_DESCRIPTION_MODEL,
        max_tokens: 700,
        temperature: 0.4,
        system:
          "Você escreve descrições para um portal de vagas de Jovem Aprendiz. O portal NÃO é a empresa contratante — apenas divulga a vaga. Escreva em 2 a 3 parágrafos, tom informativo e acolhedor para jovens de 14 a 24 anos. Não invente informações que não foram fornecidas. Não use bullet points. Não use slogans da empresa. Comece descrevendo a oportunidade, depois mencione o perfil esperado, depois os benefícios.",
        messages: [
          {
            role: "user",
            content: [
              `title: ${row.title}`,
              `company: ${row.companyName}`,
              `city: ${row.cityName}`,
              `state: ${row.stateName}`,
              `area: ${row.area || "Administrativo"}`,
              `requirements: ${row.requirementsText}`,
              `benefits: ${row.benefitsText}`
            ].join("\n")
          }
        ]
      })
    });

    if (!response.ok) {
      console.warn("Claude falhou ao gerar descricao unica:", response.status, await response.text());
      return row.descriptionHtml;
    }

    const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> };
    const text = data.content?.find((item) => item.type === "text" && item.text)?.text?.trim();
    return text ? sanitizeText(text) : row.descriptionHtml;
  } catch (error) {
    console.warn("Claude indisponivel; usando descricao original.", error);
    return row.descriptionHtml;
  }
}

function buildJsonError(status: number, message: string, details?: Record<string, unknown>) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      message,
      error: message,
      imported: 0,
      updated: 0,
      errors: [],
      ...details
    },
    {
      status,
      headers: RESPONSE_HEADERS
    }
  );
}

function processValidThroughMonths(validThroughMonths: number | null | undefined) {
  if (!validThroughMonths || validThroughMonths < 1 || validThroughMonths > 24) {
    return null;
  }

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setMonth(today.getMonth() + validThroughMonths);
  return futureDate;
}

function calculateValidThrough(validThroughValue: string | number | null | undefined) {
  if (!validThroughValue) return null;

  if (typeof validThroughValue === "number") {
    return processValidThroughMonths(validThroughValue);
  }

  const normalized = String(validThroughValue).replace(/^['"]+|['"]+$/g, "").trim();
  if (!normalized) return null;

  const numericMonths = Number(normalized);
  if (!Number.isNaN(numericMonths) && numericMonths > 0 && numericMonths < 1000) {
    return processValidThroughMonths(numericMonths);
  }

  const parsedDate = new Date(normalized);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const year = parsedDate.getFullYear();
  return year >= 2020 && year <= 2100 ? parsedDate : null;
}

function stateCodeFromName(stateName: string) {
  const trimmed = stateName.trim();
  if (trimmed.length <= 2) return trimmed.toUpperCase();

  const slug = normalizeSlug(trimmed).replace(/[^a-z]/g, "");
  return slug.slice(0, 2).toUpperCase() || trimmed.slice(0, 2).toUpperCase();
}

function buildCityKey(stateId: string, value: string) {
  return `${stateId}::${normalizeKey(value)}`;
}

function buildCompanyNameKey(value: string) {
  return normalizeKey(value);
}

function buildStateMaps(states: State[]) {
  const byName = new Map<string, State>();
  const byCode = new Map<string, State>();

  for (const state of states) {
    byName.set(normalizeKey(state.name), state);
    byCode.set(normalizeKey(state.code), state);
  }

  return { byName, byCode };
}

function buildCityMaps(cities: City[]) {
  const byStateAndName = new Map<string, City>();
  const byStateAndSlug = new Map<string, City>();

  for (const city of cities) {
    byStateAndName.set(buildCityKey(city.stateId, city.name), city);
    byStateAndSlug.set(buildCityKey(city.stateId, city.slug), city);
  }

  return { byStateAndName, byStateAndSlug };
}

function buildCompanyMaps(companies: Company[]) {
  const bySlug = new Map<string, Company>();
  const byName = new Map<string, Company>();

  for (const company of companies) {
    bySlug.set(company.slug, company);
    byName.set(buildCompanyNameKey(company.name), company);
  }

  return { bySlug, byName };
}

function ensureUniqueJobSlug(baseSlug: string, usedSlugs: Set<string>, currentSlug?: string) {
  let candidate = baseSlug || `vaga-${Date.now()}`;

  if (currentSlug && candidate === currentSlug) {
    usedSlugs.add(candidate);
    return candidate;
  }

  if (!usedSlugs.has(candidate)) {
    usedSlugs.add(candidate);
    return candidate;
  }

  let suffix = 2;
  while (usedSlugs.has(`${candidate}-${suffix}`)) {
    suffix += 1;
  }

  const unique = `${candidate}-${suffix}`;
  usedSlugs.add(unique);
  return unique;
}

async function ensureStates(rows: ImportedJobRow[]) {
  const existingStates = await prisma.state.findMany();
  const maps = buildStateMaps(existingStates);

  const missingStates = new Map<string, { name: string; code: string; slug: string }>();

  for (const row of rows) {
    const normalizedStateCode = normalizeBrazilianUf(row.stateName);
    if (!normalizedStateCode) continue;

    const stateName = row.stateName.trim();
    const lookupByName = maps.byName.get(normalizeKey(stateName));
    const lookupByCode = maps.byCode.get(normalizeKey(stateName));
    if (lookupByName || lookupByCode) continue;

    const code = stateCodeFromName(stateName);
    const codeConflict = existingStates.find((state) => state.code === code && normalizeKey(state.name) !== normalizeKey(stateName));
    if (codeConflict) {
      continue;
    }

    missingStates.set(normalizeKey(stateName), {
      name: stateName,
      code,
      slug: normalizeSlug(stateName)
    });
  }

  for (const state of missingStates.values()) {
    const created = await prisma.state.create({
      data: {
        code: state.code,
        name: state.name,
        slug: state.slug,
        seoTitle: `Vagas de Jovem Aprendiz em ${state.name}`,
        seoIntro: `Veja todas as vagas de Jovem Aprendiz disponiveis em ${state.name}.`
      }
    });

    existingStates.push(created);
    maps.byName.set(normalizeKey(created.name), created);
    maps.byCode.set(normalizeKey(created.code), created);
  }

  return {
    states: existingStates,
    statesByName: maps.byName,
    statesByCode: maps.byCode
  };
}

async function ensureCities(rows: ImportedJobRow[], statesByName: Map<string, State>, statesByCode: Map<string, State>) {
  const states = new Map<string, State>();

  for (const row of rows) {
    const state = statesByName.get(normalizeKey(row.stateName)) ?? statesByCode.get(normalizeKey(row.stateName));
    if (state) {
      states.set(state.id, state);
    }
  }

  const existingCities = await prisma.city.findMany({
    where: {
      stateId: { in: Array.from(states.keys()) }
    }
  });
  const maps = buildCityMaps(existingCities);

  for (const row of rows) {
    const state = statesByName.get(normalizeKey(row.stateName)) ?? statesByCode.get(normalizeKey(row.stateName));
    if (!state) continue;

    const cityName = row.cityName.trim();
    const slug = normalizeSlug(cityName);
    if (maps.byStateAndName.has(buildCityKey(state.id, cityName)) || maps.byStateAndSlug.has(buildCityKey(state.id, slug))) {
      continue;
    }

    const created = await prisma.city.create({
      data: {
        stateId: state.id,
        name: cityName,
        slug,
        seoTitle: `Vagas de Jovem Aprendiz em ${cityName}`,
        seoIntro: `Veja vagas de Jovem Aprendiz em ${cityName}, ${state.code}.`
      }
    });

    existingCities.push(created);
    maps.byStateAndName.set(buildCityKey(created.stateId, created.name), created);
    maps.byStateAndSlug.set(buildCityKey(created.stateId, created.slug), created);
  }

  return {
    citiesByStateAndName: maps.byStateAndName,
    citiesByStateAndSlug: maps.byStateAndSlug
  };
}

async function ensureCompanies(
  rows: ImportedJobRow[],
  statesByName: Map<string, State>,
  statesByCode: Map<string, State>,
  citiesByStateAndName: Map<string, City>,
  citiesByStateAndSlug: Map<string, City>
) {
  const requestedSlugs = Array.from(new Set(rows.map((row) => normalizeSlug(row.companyName))));
  const requestedNames = Array.from(new Set(rows.map((row) => row.companyName.trim())));

  const companies = await prisma.company.findMany({
    where: {
      OR: [
        { slug: { in: requestedSlugs } },
        ...requestedNames.map((name) => ({
          name: { equals: name, mode: "insensitive" as const }
        }))
      ]
    }
  });
  const maps = buildCompanyMaps(companies);

  for (const row of rows) {
    const slug = normalizeSlug(row.companyName);
    const nameKey = buildCompanyNameKey(row.companyName);
    if (maps.bySlug.has(slug) || maps.byName.has(nameKey)) continue;

    const state = statesByName.get(normalizeKey(row.stateName)) ?? statesByCode.get(normalizeKey(row.stateName));
    if (!state) continue;

    const city =
      citiesByStateAndName.get(buildCityKey(state.id, row.cityName)) ??
      citiesByStateAndSlug.get(buildCityKey(state.id, normalizeSlug(row.cityName)));

    if (!city) continue;

    const created = await prisma.company.create({
      data: {
        name: row.companyName.trim(),
        slug,
        summary: row.summary.trim() || `${row.companyName.trim()} com vagas de Jovem Aprendiz publicadas no portal.`,
        isActive: true,
        featured: false,
        stateId: state.id,
        cityId: city.id
      }
    });

    maps.bySlug.set(created.slug, created);
    maps.byName.set(buildCompanyNameKey(created.name), created);
  }

  return {
    companiesBySlug: maps.bySlug,
    companiesByName: maps.byName
  };
}

async function buildImportContext(rows: ImportedJobRow[]): Promise<ImportContext> {
  const { statesByName, statesByCode } = await ensureStates(rows);
  const { citiesByStateAndName, citiesByStateAndSlug } = await ensureCities(rows, statesByName, statesByCode);
  const { companiesBySlug, companiesByName } = await ensureCompanies(
    rows,
    statesByName,
    statesByCode,
    citiesByStateAndName,
    citiesByStateAndSlug
  );

  const requestedExternalIds = Array.from(new Set(rows.map((row) => row.externalId?.trim()).filter(Boolean))) as string[];
  const explicitSlugs = Array.from(
    new Set(
      rows
        .map((row) => (row.slug?.trim() ? normalizeSlug(row.slug.trim()) : ""))
        .filter((slug): slug is string => Boolean(slug))
    )
  );
  const orFilters: Prisma.JobWhereInput[] = [];
  if (requestedExternalIds.length) {
    orFilters.push({ externalId: { in: requestedExternalIds } });
  }
  if (explicitSlugs.length) {
    orFilters.push({ slug: { in: explicitSlugs } });
  }

  const existingJobs =
    orFilters.length > 0
      ? await prisma.job.findMany({
          where: { OR: orFilters },
          select: {
            id: true,
            slug: true,
            title: true,
            seoTitle: true,
            publishedAt: true,
            externalId: true,
            applyUrl: true,
            sourceUrl: true,
            jobTitle: true
          }
        })
      : [];

  const jobLookup = buildImportJobLookup(existingJobs as JobImportSnapshot[]);

  const context: ImportContext = {
    statesByName,
    statesByCode,
    citiesByStateAndName,
    citiesByStateAndSlug,
    companiesBySlug,
    companiesByName,
    jobLookup,
    issues: [],
    imported: [],
    updated: [],
    processedRows: 0,
    summary: emptyImportSummaryReport(),
    touchedSlugs: []
  };

  return context;
}

function resolveState(context: ImportContext, row: ImportedJobRow) {
  const stateCode = normalizeBrazilianUf(row.stateName);
  if (!stateCode) return null;
  return context.statesByCode.get(normalizeKey(stateCode)) ?? null;
}

function resolveCity(context: ImportContext, stateId: string, row: ImportedJobRow) {
  return (
    context.citiesByStateAndName.get(buildCityKey(stateId, row.cityName)) ??
    context.citiesByStateAndSlug.get(buildCityKey(stateId, normalizeSlug(row.cityName))) ??
    null
  );
}

function resolveCompany(context: ImportContext, row: ImportedJobRow) {
  return context.companiesBySlug.get(normalizeSlug(row.companyName)) ?? context.companiesByName.get(buildCompanyNameKey(row.companyName)) ?? null;
}

async function persistImportedRow(rowForSave: ImportedJobRow, context: ImportContext) {
  const state = resolveState(context, rowForSave);
  if (!state) throw new Error(`Estado nao encontrado para "${rowForSave.stateName}".`);
  const city = resolveCity(context, state.id, rowForSave);
  if (!city) throw new Error(`Cidade nao encontrada para "${rowForSave.cityName}".`);
  const company = resolveCompany(context, rowForSave);
  if (!company) throw new Error(`Empresa nao encontrada para "${rowForSave.companyName}".`);

  const normalizedDescription = richTextFromInput(rowForSave.descriptionHtml, { baseHeadingLevel: 2 });
  const validThrough = processValidThroughMonths(rowForSave.validThroughMonths) ?? calculateValidThrough(rowForSave.validThrough);

  const existing = findExistingJobSnapshot(rowForSave, context.jobLookup);

  if (existing) {
    const updateData = buildJobUpdateData(
      rowForSave,
      state,
      city,
      company,
      existing,
      normalizedDescription,
      processValidThroughMonths,
      calculateValidThrough
    );
    const saved = await prisma.job.update({ where: { id: existing.id }, data: updateData });
    const snap = snapshotFromPersisted(saved);

    if (saved.title === existing.title) {
      context.summary.oldTitlesPreserved += 1;
    } else {
      context.summary.titleOverwritesInvalid += 1;
    }
    if (saved.slug === existing.slug) {
      context.summary.oldSlugsPreserved += 1;
    } else {
      context.summary.slugMutationsInvalid += 1;
    }
    if (existing.seoTitle?.trim() && saved.seoTitle === existing.seoTitle) {
      context.summary.oldSeoTitlesPreserved += 1;
    }

    context.summary.existingJobsUpdated += 1;
    context.updated.push(saved.slug);
    context.touchedSlugs.push(saved.slug);
    registerSnapshotInLookup(context.jobLookup, snap);
    return;
  }

  const baseSlug = buildNewJobSlugBase(rowForSave, state, city, company);
  const uniqueSlug = ensureUniqueJobSlug(baseSlug, context.jobLookup.usedJobSlugs, undefined);
  const createData = buildJobCreateData(rowForSave, state, city, company, uniqueSlug, normalizedDescription, validThrough);
  const saved = await prisma.job.create({ data: createData });
  const snap = snapshotFromPersisted(saved);

  context.summary.newJobsCreated += 1;
  context.imported.push(saved.slug);
  context.touchedSlugs.push(saved.slug);
  registerSnapshotInLookup(context.jobLookup, snap);
}

async function processRows(rows: ImportedJobRow[], context: ImportContext, queueId?: string, options?: { useAi?: boolean }) {
  for (const [index, row] of rows.entries()) {
    const line = index + 2;

    try {
      const rowForSave = options?.useAi ? { ...row, descriptionHtml: await generateUniqueDescriptionWithClaude(row) } : row;
      await persistImportedRow(rowForSave, context);
      context.processedRows += 1;

      if (queueId) {
        await prisma.importQueue.update({
          where: { id: queueId },
          data: {
            processedRows: context.processedRows,
            importedCount: context.imported.length,
            updatedCount: context.updated.length,
            errorCount: context.issues.length
          }
        });
      }
    } catch (error) {
      context.issues.push({
        line,
        title: row.title,
        message: error instanceof Error ? error.message : "Erro desconhecido ao processar a linha."
      });
      context.processedRows += 1;
      if (queueId) {
        await prisma.importQueue.update({
          where: { id: queueId },
          data: { processedRows: context.processedRows, errorCount: context.issues.length }
        });
      }
    }
  }

  const uniqueTouched = [...new Set(context.touchedSlugs)];
  context.summary.schemaTitlePollutedCount = await countSchemaTitlePollutedForSlugs(uniqueTouched);
  await finalizeImportReport(context.summary);
}

async function processQueuedImport(queueId: string) {
  const startedAt = Date.now();
  const claimed = await prisma.importQueue.updateMany({
    where: { id: queueId, status: ImportQueueStatus.PENDING },
    data: { status: ImportQueueStatus.PROCESSING, startedAt: new Date() }
  });
  if (!claimed.count) {
    return;
  }

  const queue = await prisma.importQueue.findUnique({ where: { id: queueId } });
  if (!queue) return;

  try {
    const payload = importJobsPayloadSchema.parse(queue.payload);
    const rows = payload.rows.map(sanitizeImportedRow);
    const context = await buildImportContext(rows);
    await processRows(rows, context, queueId, { useAi: false });

    if (context.imported.length || context.updated.length) {
      revalidatePublicSurfacesAfterBulkJobChange();
    }

    await markExpiredJobsInactive();

    await prisma.importQueue.update({
      where: { id: queueId },
      data: {
        status: ImportQueueStatus.COMPLETED,
        finishedAt: new Date(),
        processedRows: rows.length,
        importedCount: context.imported.length,
        updatedCount: context.updated.length,
        errorCount: context.issues.length,
        result: {
          durationMs: Date.now() - startedAt,
          imported: context.imported,
          updated: context.updated,
          issues: context.issues,
          importReport: context.summary,
          importReportText: formatImportReportMessage(context.summary)
        }
      }
    });

    await writeAuditLog({
      actorId: queue.createdById ?? undefined,
      actorName: queue.createdByName ?? undefined,
      actorEmail: queue.createdByEmail ?? undefined,
      action: AuditAction.IMPORT,
      entityType: "job-import-queue",
      entityId: queueId,
      summary: "Importacao de vagas finalizada em fila",
      after: {
        importedCount: context.imported.length,
        updatedCount: context.updated.length,
        errorCount: context.issues.length,
        importReport: context.summary
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel processar a fila de importacao.";
    await prisma.importQueue.update({
      where: { id: queueId },
      data: {
        status: ImportQueueStatus.FAILED,
        finishedAt: new Date(),
        errorMessage: message
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireApiRole("EDITOR");
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return buildJsonError(400, "A API de importacao recebeu um corpo invalido. Envie JSON com a lista de linhas.");
    }

    const payload = importJobsPayloadSchema.parse(rawBody);
    const rows = payload.rows.map(sanitizeImportedRow);
    if (!rows.length) {
      return buildJsonError(400, "Nenhuma linha valida foi enviada para importacao.");
    }

    const inlineParam = new URL(request.url).searchParams.get("inline");
    const shouldProcessInline = inlineParam === "1" || inlineParam === "true" || (rows.length <= DIRECT_IMPORT_LIMIT);

    if (shouldProcessInline) {
      const startedAt = Date.now();
      const context = await buildImportContext(rows);
      await processRows(rows, context, undefined, { useAi: false });

      if (context.imported.length || context.updated.length) {
        revalidatePublicSurfacesAfterBulkJobChange();
      }

      await markExpiredJobsInactive();

      return NextResponse.json(
        {
          ok: true,
          success: true,
          mode: "direct",
          summary: {
            totalRows: rows.length,
            importedCount: context.imported.length,
            updatedCount: context.updated.length,
            errorCount: context.issues.length,
            successRate: rows.length ? Math.round(((rows.length - context.issues.length) / rows.length) * 100) : 100,
            durationMs: Date.now() - startedAt
          },
          importReport: context.summary,
          importReportText: formatImportReportMessage(context.summary),
          results: {
            errors: context.issues.map((issue) => ({ line: issue.line, message: issue.message }))
          }
        },
        { headers: RESPONSE_HEADERS }
      );
    }

    const queue = await prisma.importQueue.create({
      data: {
        status: ImportQueueStatus.PENDING,
        payload: payload,
        totalRows: rows.length,
        createdById: session.sub,
        createdByName: session.name,
        createdByEmail: session.email
      },
      select: { id: true, status: true, totalRows: true, createdAt: true }
    });

    void processQueuedImport(queue.id);

    return NextResponse.json(
      {
        ok: true,
        queueId: queue.id,
        status: queue.status,
        totalRows: queue.totalRows,
        createdAt: queue.createdAt
      },
      { headers: RESPONSE_HEADERS }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel enfileirar a importacao.";
    return buildJsonError(400, message);
  }
}
