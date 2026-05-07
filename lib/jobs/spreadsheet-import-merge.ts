import type { City, Company, Job, LocationType, State } from "@prisma/client";

import { normalizeSlug, parseOptionalDate, richTextFromInput } from "@/lib/admin/content";
import { parseSpreadsheetEmploymentType } from "@/lib/jobs/employment-type";
import { extractJobTitle, sanitizeSpreadsheetTitle } from "@/lib/jobs/job-title-schema";
import type { ImportedJobRow } from "@/lib/schemas/job-import";

export type JobImportSnapshot = Pick<
  Job,
  "id" | "slug" | "title" | "seoTitle" | "publishedAt" | "externalId" | "applyUrl" | "sourceUrl" | "jobTitle"
>;

export type ImportJobLookup = {
  jobsByExternalId: Map<string, JobImportSnapshot>;
  jobsBySlug: Map<string, JobImportSnapshot>;
  usedJobSlugs: Set<string>;
};

/**
 * Casamento vaga existente: só `externalId` e coluna explícita `slug` da planilha.
 * Não usa `applyUrl`/`sourceUrl` (links genéricos geram falsas "atualizações").
 */
export function buildImportJobLookup(jobs: JobImportSnapshot[]): ImportJobLookup {
  const jobsByExternalId = new Map<string, JobImportSnapshot>();
  const jobsBySlug = new Map<string, JobImportSnapshot>();
  const usedJobSlugs = new Set<string>();

  for (const job of jobs) {
    usedJobSlugs.add(job.slug);
    jobsBySlug.set(job.slug, job);
    if (job.externalId) {
      jobsByExternalId.set(job.externalId, job);
    }
  }

  return { jobsByExternalId, jobsBySlug, usedJobSlugs };
}

export function registerSnapshotInLookup(lookup: ImportJobLookup, job: JobImportSnapshot) {
  lookup.usedJobSlugs.add(job.slug);
  lookup.jobsBySlug.set(job.slug, job);
  if (job.externalId) {
    lookup.jobsByExternalId.set(job.externalId, job);
  }
}

export function findExistingJobSnapshot(row: ImportedJobRow, lookup: ImportJobLookup): JobImportSnapshot | null {
  const ext = row.externalId?.trim();
  if (ext) {
    const byExt = lookup.jobsByExternalId.get(ext);
    if (byExt) return byExt;
  }
  const slugCol = row.slug?.trim();
  if (slugCol) {
    const bySlug = lookup.jobsBySlug.get(normalizeSlug(slugCol));
    if (bySlug) return bySlug;
  }
  return null;
}

export function buildNewJobSlugBase(row: ImportedJobRow, state: State, city: City, company: Company): string {
  const titlePart = normalizeSlug(sanitizeSpreadsheetTitle(row.title)) || "vaga";
  const cityPart = city.slug || normalizeSlug(row.cityName);
  const ufPart = state.code.toLowerCase();
  const companyPart = company.slug;
  const ext = row.externalId?.trim();
  const parts = [titlePart, cityPart, ufPart, companyPart, ext ? normalizeSlug(ext) : ""].filter(Boolean);
  const joined = parts.join("-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return joined.slice(0, 180) || `vaga-${Date.now()}`;
}

function ensureSeoTitle(row: ImportedJobRow, city: City, state: State, company: Company): string {
  const fromRow = row.seoTitle?.trim() ?? "";
  if (fromRow.length >= 10) return fromRow;
  return sanitizeSpreadsheetTitle(
    `${sanitizeSpreadsheetTitle(row.title)} — ${company.name}, ${city.name} — ${state.code}`
  ).slice(0, 500);
}

function ensureSeoDescription(row: ImportedJobRow, city: City, state: State): string {
  const d = row.seoDescription?.trim() ?? "";
  if (d.length >= 20) return d;
  const fb = `Vaga de Jovem Aprendiz: ${sanitizeSpreadsheetTitle(row.title)} em ${city.name}, ${state.code}. Resumo, requisitos e link oficial para candidatura.`;
  return fb.slice(0, 5000);
}

export function buildJobCreateData(
  row: ImportedJobRow,
  state: State,
  city: City,
  company: Company,
  slug: string,
  descriptionHtmlNormalized: string,
  validThrough: Date | null
) {
  const title = sanitizeSpreadsheetTitle(row.title);
  const extracted = extractJobTitle(title);
  const jobTitle = extracted.trim() || title;

  return {
    title,
    jobTitle,
    slug,
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary: row.summary.trim(),
    descriptionHtml: descriptionHtmlNormalized,
    requirements: [],
    benefits: [],
    salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
    salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
    employmentType: parseSpreadsheetEmploymentType(row.employmentType),
    workHours: row.workHours?.trim() || null,
    expiresAt: parseOptionalDate(row.expiresAt),
    validThrough,
    applyUrl: row.applyUrl.trim(),
    isActive: row.isActive,
    sourceName: row.sourceName?.trim() || null,
    sourceUrl: row.sourceUrl?.trim() || null,
    locationType: row.locationType as LocationType,
    seoTitle: ensureSeoTitle(row, city, state, company),
    seoDescription: ensureSeoDescription(row, city, state),
    featured: row.featured,
    externalId: row.externalId?.trim() || null,
    publishedAt: parseOptionalDate(row.publishedAt) ?? new Date(),
    companyId: company.id,
    stateId: state.id,
    cityId: city.id
  };
}

type ValidThroughFn = (months: number | null | undefined) => Date | null;
type CalculateValidThroughFn = (value: string | number | null | undefined) => Date | null;

export function buildJobUpdateData(
  row: ImportedJobRow,
  state: State,
  city: City,
  company: Company,
  existing: JobImportSnapshot,
  descriptionHtmlNormalized: string,
  processValidThroughMonths: ValidThroughFn,
  calculateValidThrough: CalculateValidThroughFn
) {
  const hadSeoTitle = Boolean(existing.seoTitle?.trim());
  const nextSeoTitle = hadSeoTitle ? undefined : ensureSeoTitle(row, city, state, company);

  const hadJobTitle = Boolean(existing.jobTitle?.trim());
  const nextJobTitle = hadJobTitle ? undefined : extractJobTitle(existing.title).trim() || undefined;

  const validThrough =
    processValidThroughMonths(row.validThroughMonths) ?? calculateValidThrough(row.validThrough);

  const externalIdPatch =
    !existing.externalId?.trim() && row.externalId?.trim() ? { externalId: row.externalId.trim() } : {};

  return {
    companyName: company.name,
    companyLogoUrl: company.logoUrl,
    companyWebsiteUrl: company.websiteUrl,
    summary: row.summary.trim(),
    descriptionHtml: descriptionHtmlNormalized,
    salaryMin: row.salaryMin ? Math.round(row.salaryMin) : null,
    salaryMax: row.salaryMax ? Math.round(row.salaryMax) : null,
    employmentType: parseSpreadsheetEmploymentType(row.employmentType),
    workHours: row.workHours?.trim() || null,
    expiresAt: parseOptionalDate(row.expiresAt),
    validThrough,
    applyUrl: row.applyUrl.trim(),
    isActive: row.isActive,
    sourceName: row.sourceName?.trim() || null,
    sourceUrl: row.sourceUrl?.trim() || null,
    locationType: row.locationType as LocationType,
    seoDescription: ensureSeoDescription(row, city, state),
    featured: row.featured,
    companyId: company.id,
    stateId: state.id,
    cityId: city.id,
    ...(nextSeoTitle ? { seoTitle: nextSeoTitle } : {}),
    ...(nextJobTitle ? { jobTitle: nextJobTitle } : {}),
    ...externalIdPatch
  };
}

export function snapshotFromPersisted(
  job: Pick<Job, "id" | "slug" | "title" | "seoTitle" | "publishedAt" | "externalId" | "applyUrl" | "sourceUrl" | "jobTitle">
): JobImportSnapshot {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    seoTitle: job.seoTitle,
    publishedAt: job.publishedAt,
    externalId: job.externalId,
    applyUrl: job.applyUrl,
    sourceUrl: job.sourceUrl,
    jobTitle: job.jobTitle
  };
}
