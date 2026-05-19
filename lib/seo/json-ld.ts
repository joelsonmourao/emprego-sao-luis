import type { EmploymentType } from "@prisma/client";

import { siteConfig } from "@/lib/constants";
import { normalizeDatePostedForSchema, normalizeValidThroughSchemaString } from "@/lib/date-utils";
import { resolveBrazilUfFromJobState } from "@/lib/geo/municipios-coordenadas";
import { cleanJobDescriptionForSchema } from "@/lib/jobs/job-posting-description";
import { validateJobPostingMinimum } from "@/lib/jobs/job-posting-validate";
import type { TrustedLocationEnrichment } from "@/lib/location/types";
import { parseSalaryMinForJobPostingSchema } from "@/lib/seo/salary-min-schema";
import { getVagasEmpresaPath } from "@/lib/seo/jobs-pages";
import { absoluteUrl } from "@/lib/utils";

export function buildOrganizationJsonLd(input?: { name?: string; logoUrl?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input?.name ?? "Jovem Aprendiz Vagas",
    url: absoluteUrl("/"),
    logo: absoluteUrl(input?.logoUrl ?? "/brand-logo.svg")
  };
}

export function buildWebsiteJsonLd(input?: { name?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input?.name ?? "Jovem Aprendiz Vagas",
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/busca")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildWebPageJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path)
  };
}

export function buildItemListJsonLdFromJobs(items: Array<{ position: number; name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: absoluteUrl(item.path)
    }))
  };
}

/** Place simples (lista SEO) — sem coordenadas quando não há lat/lng confiáveis no banco. */
export function buildPlaceJsonLdForCityLocality(input: { cityName: string; stateCode: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${input.cityName}, ${input.stateCode}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: input.cityName.trim(),
      addressRegion: input.stateCode.trim(),
      addressCountry: { "@type": "Country", name: "Brazil" }
    }
  };
}

const JOB_POSTING_EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME"] as const;
const IDENTIFIER_NAME = "Jovem Aprendiz Vagas";
const DEFAULT_HIRING_ORGANIZATION_LOGO = "https://slzcontent.com.br/icon.svg";

export type JobPostingJsonLdInput = {
  id: string;
  externalId?: string | null;
  /** Título salvo no banco (planilha / importação). */
  storedTitle: string;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  companySlug?: string | null;
  cityName: string;
  stateCode: string;
  stateName: string;
  /** Primeira publicação (imutável na edição). */
  publishedAt: string | Date;
  /** Criação no banco — fallback só se `publishedAt` estiver ausente. */
  createdAt?: string | Date | null;
  expiresAt: string | Date | null;
  validThrough?: string | Date | null;
  salaryMin: number | null;
  /** Localização detalhada já persistida (cache); nunca preencher via API na página pública. */
  locationEnrichment?: TrustedLocationEnrichment | null;
  /** Mantido para validação mínima legada; employmentType no schema é fixo. */
  employmentType: EmploymentType;
};

export function sanitizeISODate(dateStr: string | undefined | null) {
  return dateStr?.replace(/\.\d{3}Z$/, "Z") ?? dateStr;
}

function isPlaceholderSentinel(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") {
    const v = value.trim();
    if (!v) return true;
    const low = v.toLowerCase();
    if (low === "n/a" || low === "na" || low === "undefined" || low === "null") return true;
    if (low === "não informado" || low === "nao informado" || low === "n/d" || low === "s/d") return true;
    if (low === "a combinar" || low === "indefinido" || low === "indeterminado") return true;
  }
  return false;
}

export function stringifyJobPostingJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(removeEmptyJsonLdValues(data)).replace(/</g, "\\u003c");
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveHiringOrganizationLogo(companyLogoUrl?: string | null) {
  const u = companyLogoUrl?.trim();
  if (!u) return DEFAULT_HIRING_ORGANIZATION_LOGO;
  if (u.startsWith("https://") || u.startsWith("http://")) return u;
  if (u.startsWith("/")) return absoluteUrl(u);
  return DEFAULT_HIRING_ORGANIZATION_LOGO;
}

function resolveHiringOrganizationSameAs(input: {
  companyWebsiteUrl?: string | null;
  companySlug?: string | null;
}) {
  const website = input.companyWebsiteUrl?.trim();
  if (website && isValidHttpUrl(website)) return website;

  const slug = input.companySlug?.trim();
  if (slug) return absoluteUrl(getVagasEmpresaPath(slug));

  return undefined;
}

function buildBaseSalaryBlock(salaryMin: number | null) {
  const value = parseSalaryMinForJobPostingSchema(salaryMin);
  if (value == null) return null;

  return {
    "@type": "MonetaryAmount",
    currency: "BRL",
    value: {
      "@type": "QuantitativeValue",
      value,
      unitText: "MONTH"
    }
  };
}

function isPlaceholderStreetAddress(value: string | undefined | null) {
  if (!value?.trim()) return true;
  const v = value.trim().toLowerCase();
  return (
    v === "indefinido" ||
    v === "a definir" ||
    v === "nao informado" ||
    v === "não informado" ||
    v === "endereco nao informado" ||
    v === "endereço não informado" ||
    v === "brasil" ||
    v === "s/d" ||
    v === "-" ||
    v === "n/d" ||
    v === "centro" ||
    v === "rua nao informada" ||
    v === "rua não informada"
  );
}

function buildPostalAddressForJobPosting(job: JobPostingJsonLdInput) {
  const resolvedUf = resolveBrazilUfFromJobState(job.stateCode, job.stateName);
  const enrichment = job.locationEnrichment ?? null;

  const address: Record<string, unknown> = {
    "@type": "PostalAddress"
  };

  if (enrichment?.streetAddress && !isPlaceholderStreetAddress(enrichment.streetAddress)) {
    address.streetAddress = enrichment.streetAddress.trim();
  }

  address.addressLocality = job.cityName.trim();
  address.addressRegion = resolvedUf ?? job.stateCode.trim();

  if (enrichment?.postalCode && !isPlaceholderSentinel(enrichment.postalCode)) {
    address.postalCode = enrichment.postalCode.trim();
  }

  address.addressCountry = "BR";

  return address;
}

function buildJobLocationBlock(job: JobPostingJsonLdInput) {
  const enrichment = job.locationEnrichment ?? null;
  const place: Record<string, unknown> = {
    "@type": "Place",
    address: buildPostalAddressForJobPosting(job)
  };

  const lat = enrichment?.latitude;
  const lng = enrichment?.longitude;
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: lat,
      longitude: lng
    };
  }

  return place;
}

function buildHiringOrganizationBlock(job: JobPostingJsonLdInput) {
  const org: Record<string, unknown> = {
    "@type": "Organization",
    name: job.companyName.trim()
  };

  const sameAs = resolveHiringOrganizationSameAs({
    companyWebsiteUrl: job.companyWebsiteUrl,
    companySlug: job.companySlug
  });
  if (sameAs) org.sameAs = sameAs;

  const logo = resolveHiringOrganizationLogo(job.companyLogoUrl);
  if (logo) org.logo = logo;

  return org;
}

export function buildJobPostingJsonLd(job: JobPostingJsonLdInput): Record<string, unknown> | null {
  const schemaPostingTitle = job.storedTitle.trim();
  if (!schemaPostingTitle) return null;

  const descriptionHtml = cleanJobDescriptionForSchema(job.descriptionHtml, {
    slug: job.slug,
    id: job.id,
    title: schemaPostingTitle
  });

  const datePostedSource = job.publishedAt ?? job.createdAt ?? null;
  const datePostedRaw = normalizeDatePostedForSchema(datePostedSource);
  const validThroughRaw = normalizeValidThroughSchemaString({
    publishedAt: job.publishedAt,
    validThrough: job.validThrough ?? null,
    expiresAt: job.expiresAt
  });

  if (!datePostedRaw?.trim() || !validThroughRaw?.trim()) {
    return null;
  }

  const hiringOrganization = buildHiringOrganizationBlock(job);
  const jobLocation = buildJobLocationBlock(job);
  const hasDetailedLocation = Boolean(
    (job.locationEnrichment?.streetAddress && job.locationEnrichment?.postalCode) ||
      job.locationEnrichment?.latitude != null
  );

  if (!hasDetailedLocation) {
    console.info(
      `[job-posting-schema] JobPosting sem streetAddress/postalCode/geo para vaga ${job.slug} (${job.companyName} / ${job.cityName}).`
    );
  }

  const baseSalary = buildBaseSalaryBlock(job.salaryMin);
  if (baseSalary) {
    console.info(`[job-posting-schema] baseSalary incluído (salaryMin) para vaga ${job.slug}.`);
  } else {
    console.info(`[job-posting-schema] baseSalary omitido — salaryMin inválido para vaga ${job.slug}.`);
  }

  /** Ordem fixa dos campos no JSON-LD serializado (schema.org JobPosting). */
  const data: Record<string, unknown> = {};
  data["@context"] = "https://schema.org/";
  data["@type"] = "JobPosting";
  data.title = schemaPostingTitle;
  data.description = descriptionHtml;
  data.identifier = {
    "@type": "PropertyValue",
    name: IDENTIFIER_NAME,
    value: (job.externalId?.trim() || job.id).trim()
  };
  data.datePosted = datePostedRaw;
  data.validThrough = validThroughRaw;
  data.employmentType = [...JOB_POSTING_EMPLOYMENT_TYPES];
  data.hiringOrganization = hiringOrganization;
  data.jobLocation = jobLocation;
  if (baseSalary) {
    data.baseSalary = baseSalary;
  }
  data.directApply = false;

  const cleaned = removeEmptyJsonLdValues(data) as Record<string, unknown>;

  const validation = validateJobPostingMinimum({
    displayTitle: schemaPostingTitle,
    descriptionHtml: String(cleaned.description ?? ""),
    datePosted: String(cleaned.datePosted ?? ""),
    validThrough: String(cleaned.validThrough ?? ""),
    companyName: job.companyName,
    cityName: job.cityName,
    stateCode: job.stateCode
  });

  if (!validation.ok) {
    console.warn(`[job-posting-schema] JobPosting omitido para ${job.slug}: ${validation.reason}`);
    return null;
  }

  console.info(`[job-posting-schema] JSON-LD JobPosting renderizado para vaga ${job.slug}.`);
  return cleaned;
}

export function stringifyJsonLdSafe(data: Record<string, unknown>) {
  return JSON.stringify(removeEmptyJsonLdValues(data)).replace(/</g, "\\u003c");
}

function removeEmptyJsonLdValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeEmptyJsonLdValues(item)).filter((item) => item !== null && item !== undefined && item !== "") as T;
  }

  if (value && typeof value === "object") {
    const cleaned: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(value)) {
      if (key === "monthsOfExperience") continue;
      if (entry === null || entry === undefined || entry === "") continue;
      if (typeof entry === "string" && isPlaceholderSentinel(entry)) continue;

      const next = removeEmptyJsonLdValues(entry);
      if (Array.isArray(next) && !next.length) continue;
      if (next && typeof next === "object" && !Array.isArray(next) && !Object.keys(next).length) continue;

      cleaned[key] = next;
    }

    return cleaned as T;
  }

  return value;
}
