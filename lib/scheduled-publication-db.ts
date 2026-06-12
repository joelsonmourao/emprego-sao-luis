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
import type { ScheduledJobUploadItem, ScheduledJobUploadRow } from "@/lib/schemas/scheduled-job-upload";
import { scheduledJobUploadRowSchema } from "@/lib/schemas/scheduled-job-upload";
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
  return `${title || "Vaga de emprego"}. Veja requisitos, beneficios e jornada em ${city}/${state}.`;
}

function buildSummary(title: string, city: string, state: string) {
  return title || `Vaga em ${city} ${state}`;
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
  const baseSlugs = Array.from(
    new Set(rows.map((row) => normalizeSlug(row.slug || row.title || row.seoTitle).trim()).filter(Boolean))
  );

  const usedSlugs = new Set<string>();

  if (baseSlugs.length) {
    const existingBySlug = await prisma.job.findMany({
      where: { OR: baseSlugs.map((slug) => ({ slug: { startsWith: slug } })) },
      select: { slug: true }
    });
    for (const job of existingBySlug) {
      usedSlugs.add(job.slug);
    }
  }

  return {
    statesByInput: new Map<string, State>(),
    citiesByKey: new Map<string, City>(),
    companiesByKey: new Map<string, Company>(),
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

type ScheduledLineResultado =
  | "AGENDADA"
  | "PUBLICADA_IMEDIATAMENTE"
  | "ATUALIZADA"
  | "IGNORADA_SEM_MUDANCA"
  | "JA_PUBLICADA_PRESERVADA"
  | "ERRO";

export type ScheduledUploadLineResult = {
  numeroLinhaExcel: number;
  externalIdOriginal: string;
  externalIdFinal: string;
  applyUrl: string;
  slugOriginal: string;
  slugFinal: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
  dataHoraPublicacaoOriginal: string;
  dataHoraPublicacaoConvertida: string;
  resultado: ScheduledLineResultado;
  motivo: string;
  jobId: string;
};

function resolveScheduledPublicationDecision(value: unknown, now: Date) {
  const rawValue = value === null || value === undefined ? "" : String(value).trim();
  if (!rawValue) {
    return { ok: false as const, motivo: "dataHoraPublicacao vazia." };
  }
  const scheduledUtc = parseScheduledAtInputToUtc(value);
  if (!scheduledUtc) {
    return { ok: false as const, motivo: "Formato invalido em dataHoraPublicacao. Use dd/MM/yyyy HH:mm." };
  }
  if (scheduledUtc.getTime() <= now.getTime()) {
    return {
      ok: true as const,
      resultado: "PUBLICADA_IMEDIATAMENTE" as const,
      scheduledPublishAt: null as Date | null,
      converted: formatDateTimeKeyInTimeZone(scheduledUtc),
      status: JobStatus.PUBLISHED,
      publicationStatus: JobPublicationStatus.OK,
      isActive: true
    };
  }
  return {
    ok: true as const,
    resultado: "AGENDADA" as const,
    scheduledPublishAt: scheduledUtc,
    converted: formatDateTimeKeyInTimeZone(scheduledUtc),
    status: JobStatus.SCHEDULED,
    publicationStatus: JobPublicationStatus.AGUARDANDO_AGENDAMENTO,
    isActive: false
  };
}

async function findCompanyNameFallback() {
  const existing = await prisma.company.findFirst({ select: { name: true }, orderBy: { createdAt: "asc" } });
  return existing?.name || "Empresa nao informada";
}

function buildCompanySummary(companyName: string) {
  return `Veja vagas divulgadas pela ${companyName} no Emprego São Luís.`;
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

function createLineResult(input: {
  numeroLinhaExcel: number;
  row: Partial<ScheduledJobUploadRow>;
  resultado: ScheduledLineResultado;
  motivo: string;
  jobId?: string | null;
  slugFinal?: string | null;
  slugOriginal?: string | null;
  externalIdFinal?: string | null;
  dataHoraPublicacaoConvertida?: string;
}): ScheduledUploadLineResult {
  return {
    numeroLinhaExcel: input.numeroLinhaExcel,
    externalIdOriginal: String(input.row.externalId ?? "").trim(),
    externalIdFinal: String(input.externalIdFinal ?? input.row.externalId ?? "").trim(),
    applyUrl: String(input.row.applyUrl ?? "").trim(),
    slugOriginal:
      String(input.slugOriginal ?? "").trim() ||
      normalizeSlug(String(input.row.slug ?? "").trim() || String(input.row.title ?? "").trim() || String(input.row.seoTitle ?? "").trim()),
    slugFinal: String(input.slugFinal ?? "").trim(),
    title: String(input.row.title ?? "").trim(),
    companyName: String(input.row.companyName ?? "").trim(),
    city: String(input.row.cityName ?? "").trim(),
    state: String(input.row.stateName ?? "").trim(),
    dataHoraPublicacaoOriginal: normalizeScheduledImportRawValue(input.row.dataHoraPublicacao) ?? "",
    dataHoraPublicacaoConvertida: input.dataHoraPublicacaoConvertida ?? "",
    resultado: input.resultado,
    motivo: input.motivo,
    jobId: input.jobId ?? ""
  };
}

function jsonEquals(left: unknown, right: unknown) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

function shortHash(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash.toString(36).slice(0, 6);
}

async function ensureUniqueExternalIdForRow(rawExternalId: string, lineNumber: number, fingerprint: string) {
  const normalized = rawExternalId.trim();
  if (!normalized) {
    return `AUTO-${shortHash(`${fingerprint}-${lineNumber}-${Date.now()}`)}-${lineNumber}`;
  }

  const existing = await prisma.job.findUnique({
    where: { externalId: normalized },
    select: { id: true }
  });
  if (!existing) {
    return normalized;
  }

  let candidate = `${normalized}-DUP-${lineNumber}`;
  let suffix = 2;
  while (true) {
    const duplicate = await prisma.job.findUnique({
      where: { externalId: candidate },
      select: { id: true }
    });
    if (!duplicate) return candidate;
    candidate = `${normalized}-DUP-${lineNumber}-${suffix}`;
    suffix += 1;
  }
}

function buildLineFingerprint(input: {
  title: string;
  companyName: string;
  city: string;
  state: string;
  applyUrl: string;
  dataHoraPublicacaoOriginal: string;
  sourceUrl: string;
}) {
  return [
    normalizeKey(input.title),
    normalizeKey(input.companyName),
    normalizeKey(input.city),
    normalizeKey(input.state),
    input.applyUrl.trim().toLowerCase(),
    input.dataHoraPublicacaoOriginal.trim(),
    input.sourceUrl.trim().toLowerCase()
  ].join("||");
}

async function processScheduledUploadRow(item: ScheduledJobUploadItem, context: PublicationContext, companyNameFallback: string) {
  const parsed = scheduledJobUploadRowSchema.safeParse(item.row);
  if (!parsed.success) {
    return createLineResult({
      numeroLinhaExcel: item.numeroLinhaExcel,
      row: (item.row ?? {}) as Partial<ScheduledJobUploadRow>,
      resultado: "ERRO",
      motivo: parsed.error.issues.map((issue) => issue.message).join(" | ")
    });
  }

  const row = parsed.data;
  const now = new Date();
  const publicationDecision = resolveScheduledPublicationDecision(row.dataHoraPublicacao, now);
  if (!publicationDecision.ok) {
    return createLineResult({ numeroLinhaExcel: item.numeroLinhaExcel, row, resultado: "ERRO", motivo: publicationDecision.motivo });
  }

  const stateInput = row.stateName.trim();
  const cityInput = row.cityName.trim();
  const title = resolveSafeTitle(row);
  const companyInput = resolveSafeCompanyName(row, companyNameFallback);
  const summary = row.summary.trim() || buildSummary(title, cityInput, stateInput);
  const description = row.descriptionHtml.trim();
  const sourceUrl = row.sourceUrl?.trim() || row.applyUrl.trim();
  const slugBase = normalizeSlug(row.slug || row.title || row.seoTitle);
  const slugOriginal = normalizeSlug(row.slug || row.title || row.seoTitle);
  const dataHoraOriginal = normalizeScheduledImportRawValue(row.dataHoraPublicacao) ?? "";
  const fingerprint = buildLineFingerprint({
    title,
    companyName: companyInput,
    city: cityInput,
    state: stateInput,
    applyUrl: row.applyUrl.trim(),
    dataHoraPublicacaoOriginal: dataHoraOriginal,
    sourceUrl
  });
  const { state, city } = await resolveStateAndCityCached(context, stateInput, cityInput);
  const company = await resolveCompanyCached(context, {
    companyName: companyInput,
    stateId: state.id,
    cityId: city.id,
    websiteUrl: sourceUrl || null,
    summary: buildCompanySummary(companyInput)
  });

  const seoTitle = row.seoTitle.trim() || title;
  const seoDescription = row.seoDescription.trim() || buildSeoDescription(title, city.name, state.code);
  const normalizedRequirements = normalizeLines(row.requirementsText);
  const normalizedBenefits = normalizeLines(row.benefitsText ?? "");
  const normalizedRawDate = normalizeScheduledImportRawValue(row.dataHoraPublicacao);
  const existing = await prisma.job.findFirst({
    where: {
      title,
      companyName: companyInput,
      cityId: city.id,
      stateId: state.id,
      applyUrl: row.applyUrl.trim(),
      scheduledImportRawValue: dataHoraOriginal,
      sourceUrl: sourceUrl || null
    },
    select: {
      id: true,
      slug: true,
      externalId: true,
      status: true,
      title: true,
      publishedAt: true,
      companyId: true,
      companyName: true,
      summary: true,
      descriptionHtml: true,
      requirements: true,
      benefits: true,
      salaryMin: true,
      salaryMax: true,
      employmentType: true,
      workHours: true,
      applyUrl: true,
      sourceName: true,
      sourceUrl: true,
      locationType: true,
      seoDescription: true,
      featured: true,
      stateId: true,
      cityId: true,
      publicationStatus: true,
      isActive: true,
      scheduledPublishAt: true,
      scheduledImportRawValue: true
    }
  });

  const applyUrlAlreadyUsed =
    (await prisma.job.count({
      where: { applyUrl: row.applyUrl.trim() }
    })) > 0;

  const commonData = {
    companyId: company.id,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary,
    descriptionHtml: richTextFromInput(description, { baseHeadingLevel: 2 }),
    requirements: normalizedRequirements,
    benefits: normalizedBenefits,
    salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
    salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
    salaryCurrency: "BRL",
    employmentType: normalizeEmploymentType(row.employmentType),
    workHours: row.workHours?.trim() || null,
    expiresAt: parseOptionalDate(row.expiresAt),
    validThrough: parseOptionalDate(row.validThrough),
    applyUrl: row.applyUrl.trim(),
    sourceName: row.sourceName?.trim() || "Planilha agendada",
    sourceUrl: sourceUrl || null,
    locationType: normalizeLocationType(row.locationType),
    seoDescription,
    featured: row.featured,
    stateId: state.id,
    cityId: city.id,
    publicationStatus: publicationDecision.publicationStatus,
    status: publicationDecision.status,
    isActive: publicationDecision.isActive,
    scheduledPublishAt: publicationDecision.scheduledPublishAt,
    scheduledAt: null as Date | null,
    scheduleSource: JobScheduleSource.PLANILHA,
    scheduledImportRawValue: normalizedRawDate,
    importError: null as string | null,
    indexingStatus: JobIndexingStatus.NOT_SENT,
    indexingError: null as string | null,
    indexingLastSubmittedAt: null as Date | null
  };

  if (existing) {
    if (existing.publishedAt || existing.publicationStatus === JobPublicationStatus.OK) {
      return createLineResult({
        numeroLinhaExcel: item.numeroLinhaExcel,
        row,
        resultado: "JA_PUBLICADA_PRESERVADA",
        motivo: "Vaga ja publicada anteriormente. Publicacao preservada.",
        jobId: existing.id,
        slugFinal: existing.slug,
        slugOriginal,
        externalIdFinal: existing.externalId ?? row.externalId.trim(),
        dataHoraPublicacaoConvertida: publicationDecision.converted
      });
    }

    const isNoChange =
      existing.companyId === commonData.companyId &&
      existing.companyName === commonData.companyName &&
      existing.summary === commonData.summary &&
      existing.descriptionHtml === commonData.descriptionHtml &&
      jsonEquals(existing.requirements, commonData.requirements) &&
      jsonEquals(existing.benefits, commonData.benefits) &&
      existing.salaryMin === commonData.salaryMin &&
      existing.salaryMax === commonData.salaryMax &&
      existing.employmentType === commonData.employmentType &&
      existing.workHours === commonData.workHours &&
      existing.applyUrl === commonData.applyUrl &&
      existing.sourceName === commonData.sourceName &&
      (existing.sourceUrl ?? "") === (commonData.sourceUrl ?? "") &&
      existing.locationType === commonData.locationType &&
      (existing.seoDescription ?? "") === (commonData.seoDescription ?? "") &&
      existing.featured === commonData.featured &&
      existing.stateId === commonData.stateId &&
      existing.cityId === commonData.cityId &&
      existing.publicationStatus === commonData.publicationStatus &&
      existing.status === commonData.status &&
      existing.isActive === commonData.isActive &&
      (existing.scheduledPublishAt?.getTime() ?? 0) === (commonData.scheduledPublishAt?.getTime() ?? 0) &&
      (existing.scheduledImportRawValue ?? "") === (commonData.scheduledImportRawValue ?? "");

    if (isNoChange) {
      return createLineResult({
        numeroLinhaExcel: item.numeroLinhaExcel,
        row,
        resultado: "IGNORADA_SEM_MUDANCA",
        motivo: "Mesma vaga ja importada anteriormente, sem mudancas relevantes.",
        jobId: existing.id,
        slugFinal: existing.slug,
        slugOriginal,
        externalIdFinal: existing.externalId ?? row.externalId.trim(),
        dataHoraPublicacaoConvertida: publicationDecision.converted
      });
    }

    const updated = await prisma.job.update({
      where: { id: existing.id },
      data: {
        ...commonData,
        publishedAt: existing.publishedAt ?? (publicationDecision.resultado === "PUBLICADA_IMEDIATAMENTE" ? now : null)
      }
    });

    return createLineResult({
      numeroLinhaExcel: item.numeroLinhaExcel,
      row,
      resultado: "ATUALIZADA",
      motivo: "Mesma vaga identificada por fingerprint; registro atualizado.",
      jobId: updated.id,
      slugFinal: updated.slug,
      slugOriginal,
      externalIdFinal: updated.externalId ?? row.externalId.trim(),
      dataHoraPublicacaoConvertida: publicationDecision.converted
    });
  }

  const finalSlug = ensureUniqueJobSlug(slugBase, context.usedSlugs);
  const finalExternalId = await ensureUniqueExternalIdForRow(row.externalId.trim(), item.numeroLinhaExcel, fingerprint);
  const externalIdAdjusted = finalExternalId !== row.externalId.trim();
  const slugAdjusted = finalSlug !== slugOriginal;
  const created = await prisma.job.create({
    data: {
      title,
      slug: finalSlug,
      externalId: finalExternalId,
      seoTitle,
      publishedAt: publicationDecision.resultado === "PUBLICADA_IMEDIATAMENTE" ? now : null,
      ...commonData
    }
  });

  try {
    await ensureLocationEnrichment({ companyName: company.name, city: city.name, state: state.code });
  } catch (error) {
    console.warn(`[location-enrichment] Falha no upload agendado (${company.name} / ${city.name}):`, error);
  }

  return createLineResult({
    numeroLinhaExcel: item.numeroLinhaExcel,
    row,
    resultado: publicationDecision.resultado,
    motivo: [
      publicationDecision.resultado === "AGENDADA"
        ? "Vaga agendada com sucesso."
        : "Vaga publicada imediatamente por dataHoraPublicacao <= agora.",
      externalIdAdjusted ? "externalId repetido, novo externalId gerado automaticamente." : "",
      applyUrlAlreadyUsed ? "applyUrl repetida, mas linha mantida por possuir dados proprios de cidade/titulo/empresa." : "",
      slugAdjusted ? "slug repetido, novo slug gerado automaticamente." : ""
    ]
      .filter(Boolean)
      .join(" "),
    jobId: created.id,
    slugFinal: created.slug,
    slugOriginal,
    externalIdFinal: finalExternalId,
    dataHoraPublicacaoConvertida: publicationDecision.converted
  });
}

export type ScheduledUploadResult = {
  ok: boolean;
  totalRows: number;
  validRows: number;
  scheduled: number;
  publishedImmediately: number;
  updated: number;
  ignored: number;
  preservedPublished: number;
  errors: number;
  results: ScheduledUploadLineResult[];
};

export async function importScheduledJobsFromUploadRows(
  items: ScheduledJobUploadItem[],
  options?: { actorId?: string; actorName?: string; actorEmail?: string; actorRole?: AdminRole }
): Promise<ScheduledUploadResult> {
  const parsedRows = items
    .map((item) => scheduledJobUploadRowSchema.safeParse(item.row))
    .filter((item): item is { success: true; data: ScheduledJobUploadRow } => item.success)
    .map((item) => item.data);

  const context = await createPublicationContext(parsedRows);
  const companyNameFallback = await findCompanyNameFallback();
  const results: ScheduledUploadLineResult[] = [];
  let validRows = 0;
  let scheduled = 0;
  let publishedImmediately = 0;
  let updated = 0;
  let ignored = 0;
  let preservedPublished = 0;
  let errors = 0;

  for (const item of items) {
    try {
      const lineResult = await processScheduledUploadRow(item, context, companyNameFallback);
      results.push(lineResult);
      if (lineResult.resultado !== "ERRO") validRows += 1;
      if (lineResult.resultado === "AGENDADA") scheduled += 1;
      if (lineResult.resultado === "PUBLICADA_IMEDIATAMENTE") publishedImmediately += 1;
      if (lineResult.resultado === "ATUALIZADA") updated += 1;
      if (lineResult.resultado === "IGNORADA_SEM_MUDANCA") ignored += 1;
      if (lineResult.resultado === "JA_PUBLICADA_PRESERVADA") preservedPublished += 1;
      if (lineResult.resultado === "ERRO") errors += 1;

      console.info(
        `[import-agendada] linha ${lineResult.numeroLinhaExcel} externalIdOriginal ${lineResult.externalIdOriginal || "-"} externalIdFinal ${lineResult.externalIdFinal || "-"} resultado ${lineResult.resultado} motivo ${lineResult.motivo || "-"}`
      );

      if (lineResult.jobId) {
        await appendPublicationAuditLog({
          phase: "upload",
          jobId: lineResult.jobId,
          slug: lineResult.slugFinal || undefined,
          externalId: lineResult.externalIdFinal || undefined,
          message: `Linha ${lineResult.numeroLinhaExcel}: ${lineResult.resultado}. ${lineResult.motivo}`,
          extra: {
            resultado: lineResult.resultado,
            externalIdOriginal: lineResult.externalIdOriginal,
            externalIdFinal: lineResult.externalIdFinal,
            slugOriginal: lineResult.slugOriginal,
            slugFinal: lineResult.slugFinal,
            dataHoraPublicacaoOriginal: lineResult.dataHoraPublicacaoOriginal,
            dataHoraPublicacaoConvertida: lineResult.dataHoraPublicacaoConvertida
          }
        });
      }
    } catch (error) {
      const motivo = error instanceof Error ? error.message : "Erro inesperado ao processar linha.";
      const fallbackResult = createLineResult({
        numeroLinhaExcel: item.numeroLinhaExcel,
        row: (item.row ?? {}) as Partial<ScheduledJobUploadRow>,
        resultado: "ERRO",
        motivo
      });
      results.push(fallbackResult);
      errors += 1;
      console.info(`[import-agendada] linha ${fallbackResult.numeroLinhaExcel} externalId - resultado ERRO motivo ${motivo}`);
    }
  }

  await writeAuditLog({
    actorId: options?.actorId,
    actorName: options?.actorName,
    actorEmail: options?.actorEmail,
    actorRole: options?.actorRole,
    action: AuditAction.IMPORT,
    entityType: "scheduled-job-upload",
    summary: `Importacao agendada: total ${items.length}, agendadas ${scheduled}, publicadas imediatamente ${publishedImmediately}, atualizadas ${updated}, ignoradas sem mudanca ${ignored}, ja publicadas preservadas ${preservedPublished}, erros ${errors}`,
    after: { totalRows: items.length, validRows, scheduled, publishedImmediately, updated, ignored, preservedPublished, errors, results }
  });

  return {
    ok: errors === 0,
    totalRows: items.length,
    validRows,
    scheduled,
    publishedImmediately,
    updated,
    ignored,
    preservedPublished,
    errors,
    results
  };
}

function getDefaultLogDir() {
  const configured = process.env.SCHEDULED_JOBS_LOG_DIR?.trim();
  if (configured) {
    return path.join(configured, "scheduled-job-publication");
  }

  if (process.env.VERCEL || process.env.COOLIFY || process.env.NODE_ENV === "production") {
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
