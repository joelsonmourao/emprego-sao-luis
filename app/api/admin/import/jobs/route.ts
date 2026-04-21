import { AuditAction, EmploymentType, LocationType, type City, type Company, type Job, type State } from "@prisma/client";
import { NextResponse } from "next/server";

import { normalizeLines, normalizeSlug, parseOptionalDate, plainTextToHtml } from "@/lib/admin/content";
import { writeAuditLog } from "@/lib/audit";
import { requireApiRole } from "@/lib/authz";
import { prisma } from "@/lib/db";
import { importJobsPayloadSchema, type ImportedJobRow } from "@/lib/schemas/job-import";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store"
};

const IMPORT_BATCH_SIZE = 100;

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
};

function normalizeKey(input: string) {
  return input
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
      error: message,
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
    updated: []
  };

  return context;
}

function resolveState(context: ImportContext, row: ImportedJobRow) {
  return context.statesByName.get(normalizeKey(row.stateName)) ?? context.statesByCode.get(normalizeKey(row.stateName)) ?? null;
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
  return {
    title: row.title.trim(),
    slug,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary: row.summary.trim(),
    descriptionHtml: row.descriptionHtml.includes("<") ? row.descriptionHtml.trim() : plainTextToHtml(row.descriptionHtml.trim()),
    requirements: normalizeLines(row.requirementsText),
    benefits: normalizeLines(row.benefitsText ?? ""),
    salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
    salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
    employmentType: row.employmentType as EmploymentType,
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

async function processRows(rows: ImportedJobRow[], context: ImportContext) {
  const operations: Array<
    ReturnType<typeof prisma.job.create> | ReturnType<typeof prisma.job.update> | ReturnType<typeof prisma.job.upsert>
  > = [];

  for (const [index, row] of rows.entries()) {
    const line = index + 2;

    try {
      const state = resolveState(context, row);
      if (!state) {
        throw new Error(`Estado nao encontrado para "${row.stateName}".`);
      }

      const city = resolveCity(context, state.id, row);
      if (!city) {
        throw new Error(`Cidade nao encontrada para "${row.cityName}".`);
      }

      const company = resolveCompany(context, row);
      if (!company) {
        throw new Error(`Empresa nao encontrada para "${row.companyName}".`);
      }

      const externalId = row.externalId?.trim() || null;
      const baseSlug = normalizeSlug(row.slug || row.title);
      const existingByExternalId = externalId ? context.jobsByExternalId.get(externalId) ?? null : null;
      const existingBySlug = context.jobsBySlug.get(baseSlug) ?? null;
      const existing = existingByExternalId ?? (!externalId ? existingBySlug : null);
      const keepCurrentSlug = existingByExternalId?.slug ?? (!externalId ? existingBySlug?.slug : undefined);
      const uniqueSlug = ensureUniqueJobSlug(baseSlug, context.usedJobSlugs, keepCurrentSlug);
      const data = buildJobData(row, state, city, company, uniqueSlug, existing ?? undefined);

      if (externalId) {
        const alreadyKnown = context.jobsByExternalId.has(externalId);
        const trackedId = existingByExternalId?.id ?? `pending:${externalId}`;

        operations.push(
          prisma.job.upsert({
            where: { externalId },
            create: data,
            update: data
          })
        );

        context.jobsByExternalId.set(externalId, {
          id: trackedId,
          slug: uniqueSlug,
          publishedAt: data.publishedAt,
          externalId
        });
        context.jobsBySlug.set(uniqueSlug, {
          id: trackedId,
          slug: uniqueSlug,
          publishedAt: data.publishedAt,
          externalId
        });

        if (alreadyKnown) {
          context.updated.push(uniqueSlug);
        } else {
          context.imported.push(uniqueSlug);
        }
      } else {
        const alreadyKnownBySlug = context.jobsBySlug.has(baseSlug);

        operations.push(
          prisma.job.upsert({
            where: { slug: existing?.slug ?? uniqueSlug },
            create: data,
            update: data
          })
        );

        context.jobsBySlug.set(uniqueSlug, {
          id: `pending:${uniqueSlug}`,
          slug: uniqueSlug,
          publishedAt: data.publishedAt,
          externalId
        });
        if (alreadyKnownBySlug) {
          context.updated.push(uniqueSlug);
        } else {
          context.imported.push(uniqueSlug);
        }
      }
    } catch (error) {
      context.issues.push({
        line,
        title: row.title,
        message: error instanceof Error ? error.message : "Erro desconhecido ao processar a linha."
      });
    }
  }

  for (const batch of chunkArray(operations, IMPORT_BATCH_SIZE)) {
    if (!batch.length) continue;
    await prisma.$transaction(batch);
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const session = await requireApiRole("EDITOR");

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return buildJsonError(400, "A API de importacao recebeu um corpo invalido. Envie JSON com a lista de linhas.");
    }

    const payload = importJobsPayloadSchema.parse(rawBody);
    if (!payload.rows.length) {
      return buildJsonError(400, "Nenhuma linha valida foi enviada para importacao.");
    }

    const context = await buildImportContext(payload.rows);
    await processRows(payload.rows, context);

    await writeAuditLog({
      actorId: session.sub,
      actorName: session.name,
      actorEmail: session.email,
      actorRole: session.role,
      action: AuditAction.IMPORT,
      entityType: "job-import",
      summary: "Importacao de vagas por planilha",
      after: {
        importedCount: context.imported.length,
        updatedCount: context.updated.length,
        errorCount: context.issues.length,
        imported: context.imported,
        updated: context.updated
      }
    });

    const durationMs = Date.now() - startedAt;

    return NextResponse.json(
      {
        ok: true,
        summary: {
          totalRows: payload.rows.length,
          importedCount: context.imported.length,
          updatedCount: context.updated.length,
          errorCount: context.issues.length,
          successRate: Math.round(((context.imported.length + context.updated.length) / payload.rows.length) * 100),
          durationMs
        },
        results: {
          imported: context.imported.map((slug) => ({ slug, status: "imported" })),
          updated: context.updated.map((slug) => ({ slug, status: "updated" })),
          errors: context.issues.map((issue) => ({
            line: issue.line,
            message: issue.message,
            fullError: `${issue.title}: ${issue.message}`
          }))
        },
        debug: {
          errorDetails: context.issues.map((issue) => `Linha ${issue.line}: ${issue.message}`)
        }
      },
      {
        headers: RESPONSE_HEADERS
      }
    );
  } catch (error) {
    console.error("Erro na importacao de vagas:", error);

    const message = error instanceof Error ? error.message : "Nao foi possivel importar a planilha.";

    return buildJsonError(400, message, {
      debug: {
        errorType: error instanceof Error ? error.constructor.name : "UnknownError",
        stack: error instanceof Error ? error.stack : null
      }
    });
  }
}
