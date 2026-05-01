import { AuditAction, EmploymentType, ImportQueueStatus, LocationType, Prisma, type City, type Company, type Job, type State } from "@prisma/client";
import { NextResponse } from "next/server";

import { normalizeSlug, parseOptionalDate, richTextFromInput, sanitizeText } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { revalidatePublicSurfacesAfterBulkJobChange } from "@/lib/public-revalidate";
import { parseSpreadsheetEmploymentType } from "@/lib/jobs/employment-type";
import { markExpiredJobsInactive } from "@/lib/jobs/job-expiry";
import { importJobsPayloadSchema, type ImportedJobRow } from "@/lib/schemas/job-import";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store"
};

const IMPORT_BATCH_SIZE = 10;
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
  jobsByExternalId: Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>;
  jobsBySlug: Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>;
  usedJobSlugs: Set<string>;
  issues: ImportIssue[];
  imported: string[];
  updated: string[];
  processedRows: number;
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
    summary: sanitizeText(row.summary),
    requirementsText: sanitizeText(row.requirementsText ?? ""),
    benefitsText: sanitizeText(row.benefitsText ?? ""),
    area: sanitizeArea(row.area),
    stateName: normalizeBrazilianUf(row.stateName) ?? ""
  };
}

function hasMarkdownSyntax(text: string) {
  if (!text) return false;
  return /(^|\n)\s{0,3}(#{1,6}\s+|[-*]\s+|\d+\.\s+|> )/.test(text) || /\*\*[^*]+\*\*|`[^`]+`/.test(text);
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

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
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

function buildJobMaps(jobs: Array<Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>) {
  const byExternalId = new Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>();
  const bySlug = new Map<string, Pick<Job, "id" | "slug" | "publishedAt" | "externalId">>();
  const usedSlugs = new Set<string>();

  for (const job of jobs) {
    bySlug.set(job.slug, job);
    usedSlugs.add(job.slug);
    if (job.externalId) {
      byExternalId.set(job.externalId, job);
    }
  }

  return { byExternalId, bySlug, usedSlugs };
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

  const requestedBaseSlugs = Array.from(new Set(rows.map((row) => normalizeSlug(row.slug || row.title)).filter(Boolean)));
  const requestedExternalIds = Array.from(new Set(rows.map((row) => row.externalId?.trim()).filter(Boolean))) as string[];
  const existingJobs = await prisma.job.findMany({
    where: {
      OR: [
        ...(requestedBaseSlugs.length ? requestedBaseSlugs.map((slug) => ({ slug: { startsWith: slug } })) : []),
        ...(requestedExternalIds.length ? [{ externalId: { in: requestedExternalIds } }] : [])
      ]
    },
    select: {
      id: true,
      slug: true,
      publishedAt: true,
      externalId: true
    }
  });
  const { byExternalId, bySlug, usedSlugs } = buildJobMaps(existingJobs);

  const context: ImportContext = {
    statesByName,
    statesByCode,
    citiesByStateAndName,
    citiesByStateAndSlug,
    companiesBySlug,
    companiesByName,
    jobsByExternalId: byExternalId,
    jobsBySlug: bySlug,
    usedJobSlugs: usedSlugs,
    issues: [],
    imported: [],
    updated: [],
    processedRows: 0
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

function buildJobData(row: ImportedJobRow, state: State, city: City, company: Company, slug: string, existing?: Pick<Job, "publishedAt">) {
  const sourceDescription = row.descriptionHtml;
  const normalizedDescription = richTextFromInput(sourceDescription, { baseHeadingLevel: 2 });
  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "import-markdown-check",
      hypothesisId: "H_MD_CONVERSION",
      location: "app/api/admin/import/jobs/route.ts:buildJobData",
      message: "Descricao processada para importacao",
      data: {
        title: row.title,
        hasMarkdownSyntax: hasMarkdownSyntax(sourceDescription),
        sourcePreview: sourceDescription.slice(0, 180),
        normalizedPreview: normalizedDescription.slice(0, 220)
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  return {
    title: row.title.trim(),
    slug,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary: row.summary.trim(),
    descriptionHtml: normalizedDescription,
    requirements: [],
    benefits: [],
    salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
    salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
    employmentType: parseSpreadsheetEmploymentType(row.employmentType),
    workHours: row.workHours?.trim() || null,
    expiresAt: parseOptionalDate(row.expiresAt),
    validThrough: processValidThroughMonths(row.validThroughMonths) ?? calculateValidThrough(row.validThrough),
    applyUrl: row.applyUrl,
    isActive: row.isActive,
    sourceName: row.sourceName?.trim() || null,
    sourceUrl: row.sourceUrl?.trim() || null,
    locationType: row.locationType as LocationType,
    seoTitle: row.seoTitle.trim(),
    seoDescription: row.seoDescription.trim(),
    featured: row.featured,
    externalId: row.externalId?.trim() || null,
    publishedAt: existing?.publishedAt ?? parseOptionalDate(row.publishedAt) ?? new Date(),
    companyId: company.id,
    stateId: state.id,
    cityId: city.id
  };
}

async function processRows(rows: ImportedJobRow[], context: ImportContext, queueId?: string, options?: { useAi?: boolean }) {
  const operations: Prisma.PrismaPromise<Job>[] = [];
  const queuedRows: Array<{ slug: string; wasUpdate: boolean }> = [];

  for (const [index, row] of rows.entries()) {
    const line = index + 2;

    try {
      const state = resolveState(context, row);
      if (!state) throw new Error(`Estado nao encontrado para "${row.stateName}".`);
      const city = resolveCity(context, state.id, row);
      if (!city) throw new Error(`Cidade nao encontrada para "${row.cityName}".`);
      const company = resolveCompany(context, row);
      if (!company) throw new Error(`Empresa nao encontrada para "${row.companyName}".`);

      const externalId = row.externalId?.trim() || null;
      const baseSlug = normalizeSlug(row.slug || row.title);
      const existingByExternalId = externalId ? context.jobsByExternalId.get(externalId) ?? null : null;
      const existingBySlug = context.jobsBySlug.get(baseSlug) ?? null;
      const existing = existingByExternalId ?? (!externalId ? existingBySlug : null);
      const keepCurrentSlug = existingByExternalId?.slug ?? (!externalId ? existingBySlug?.slug : undefined);
      const uniqueSlug = ensureUniqueJobSlug(baseSlug, context.usedJobSlugs, keepCurrentSlug);
      const rowForSave = options?.useAi ? { ...row, descriptionHtml: await generateUniqueDescriptionWithClaude(row) } : row;
      const data = buildJobData(rowForSave, state, city, company, uniqueSlug, existing ?? undefined);
      const wasUpdate = externalId ? context.jobsByExternalId.has(externalId) : context.jobsBySlug.has(baseSlug);

      if (options?.useAi) {
        const saved =
          externalId && externalId.length
            ? await prisma.job.upsert({ where: { externalId }, create: data, update: data })
            : await prisma.job.upsert({ where: { slug: existing?.slug ?? uniqueSlug }, create: data, update: data });

        if (wasUpdate) {
          context.updated.push(saved.slug);
        } else {
          context.imported.push(saved.slug);
        }
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
        continue;
      }

      if (externalId) {
        operations.push(prisma.job.upsert({ where: { externalId }, create: data, update: data }));
        queuedRows.push({ slug: uniqueSlug, wasUpdate });
      } else {
        operations.push(prisma.job.upsert({ where: { slug: existing?.slug ?? uniqueSlug }, create: data, update: data }));
        queuedRows.push({ slug: uniqueSlug, wasUpdate });
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H3',location:'app/api/admin/import/jobs/route.ts:processRows:row-error',message:'Falha no processamento de linha',data:{queueId,line,title:row.title,error:error instanceof Error ? error.message : 'erro-desconhecido'},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
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

  if (options?.useAi) {
    return;
  }

  let operationOffset = 0;
  for (const batch of chunkArray(operations, IMPORT_BATCH_SIZE)) {
    if (!batch.length) continue;
    const persisted = await prisma.$transaction(batch);
    const batchRows = queuedRows.slice(operationOffset, operationOffset + persisted.length);
    operationOffset += persisted.length;

    for (let i = 0; i < persisted.length; i += 1) {
      const saved = persisted[i];
      const rowMeta = batchRows[i];
      if (rowMeta?.wasUpdate) {
        context.updated.push(saved.slug);
      } else {
        context.imported.push(saved.slug);
      }
      context.processedRows += 1;
    }

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
    // #region agent log
    fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H2',location:'app/api/admin/import/jobs/route.ts:processRows:batch-commit',message:'Batch persistido e progresso atualizado',data:{queueId,batchSize:persisted.length,processedRows:context.processedRows,imported:context.imported.length,updated:context.updated.length,errors:context.issues.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }
}

async function processQueuedImport(queueId: string) {
  const startedAt = Date.now();
  // #region agent log
  fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H1',location:'app/api/admin/import/jobs/route.ts:processQueuedImport:start',message:'Worker de fila iniciou',data:{queueId},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const claimed = await prisma.importQueue.updateMany({
    where: { id: queueId, status: ImportQueueStatus.PENDING },
    data: { status: ImportQueueStatus.PROCESSING, startedAt: new Date() }
  });
  if (!claimed.count) {
    // #region agent log
    fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H1',location:'app/api/admin/import/jobs/route.ts:processQueuedImport:not-claimed',message:'Fila nao foi reivindicada para processamento',data:{queueId,claimedCount:claimed.count},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return;
  }

  const queue = await prisma.importQueue.findUnique({ where: { id: queueId } });
  if (!queue) return;

  try {
    const payload = importJobsPayloadSchema.parse(queue.payload);
    const rows = payload.rows.map(sanitizeImportedRow);
    // #region agent log
    fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H2',location:'app/api/admin/import/jobs/route.ts:processQueuedImport:payload',message:'Payload da fila carregado',data:{queueId,totalRows:rows.length,useAi:Boolean(payload.useAi)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
          issues: context.issues
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
        errorCount: context.issues.length
      }
    });
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H1',location:'app/api/admin/import/jobs/route.ts:processQueuedImport:catch',message:'Falha geral no processamento da fila',data:{queueId,error:error instanceof Error ? error.message : 'erro-desconhecido'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
    const useAi = false;
    const rows = payload.rows.map(sanitizeImportedRow);
    // #region agent log
    fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'post-fix',hypothesisId:'H9',location:'app/api/admin/import/jobs/route.ts:POST:validated-body-no-ai',message:'API recebeu payload e desabilitou IA',data:{rows:rows.length,requestedUseAi:Boolean(payload.useAi),effectiveUseAi:false},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!rows.length) {
      return buildJsonError(400, "Nenhuma linha valida foi enviada para importacao.");
    }

    const inlineParam = new URL(request.url).searchParams.get("inline");
    const shouldProcessInline = inlineParam === "1" || inlineParam === "true" || (rows.length <= DIRECT_IMPORT_LIMIT);

    if (shouldProcessInline) {
      const startedAt = Date.now();
      const context = await buildImportContext(rows);
      await processRows(rows, context, undefined, { useAi });

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
    // #region agent log
    fetch('http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dd62ba'},body:JSON.stringify({sessionId:'dd62ba',runId:'pre-fix',hypothesisId:'H1',location:'app/api/admin/import/jobs/route.ts:POST:queue-created',message:'Fila criada para importacao',data:{queueId:queue.id,totalRows:queue.totalRows,status:queue.status},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

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
