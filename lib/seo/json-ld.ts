import type { EmploymentType } from "@prisma/client";

import { siteConfig } from "@/lib/constants";
import { normalizeDatePostedForSchema, normalizeValidThroughSchemaString } from "@/lib/date-utils";
import { getGeoCoordinatesByCityState, resolveBrazilUfFromJobState } from "@/lib/geo/municipios-coordenadas";
import { employmentTypeToSchemaValue } from "@/lib/jobs/employment-type";
import { extractJobTitle } from "@/lib/jobs/job-title-schema";
import { cleanJobDescriptionForSchema } from "@/lib/jobs/job-posting-description";
import { validateJobPostingMinimum } from "@/lib/jobs/job-posting-validate";
import { getReferencePostalCodeForCity } from "@/lib/seo/br-reference-postal";
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

const DEFAULT_HIRING_ORG_LOGO = "https://slzcontent.com.br/icon.svg";

function resolveHiringOrganizationLogo(companyLogoUrl?: string | null) {
  const u = companyLogoUrl?.trim();
  if (u && (u.startsWith("https://") || u.startsWith("http://"))) {
    return u;
  }
  if (u?.startsWith("/")) {
    return absoluteUrl(u);
  }
  return DEFAULT_HIRING_ORG_LOGO;
}

export type JobPostingJsonLdInput = {
  id: string;
  externalId?: string | null;
  seoTitle?: string | null;
  /** Título salvo no banco (H1 / página). */
  storedTitle: string;
  /** Cargo limpo para schema.org JobPosting.title (opcional). */
  jobTitle?: string | null;
  /** Legado / breadcrumb; quando omitido, usa storedTitle. */
  displayTitle: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  sourceUrl?: string | null;
  cityName: string;
  citySlug: string;
  stateCode: string;
  stateName: string;
  locationType?: "ONSITE" | "REMOTE" | "HYBRID" | string | null;
  /** Primeira publicação (imutável na edição). */
  publishedAt: string | Date;
  /** Criação no banco — fallback só se `publishedAt` estiver ausente. */
  createdAt?: string | Date | null;
  expiresAt: string | Date | null;
  validThrough?: string | Date | null;
  salaryMin: number | null;
  salaryMax: number | null;
  workHours?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  employmentType: EmploymentType;
  applyUrl: string;
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
  }
  return false;
}

export function stringifyJobPostingJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(removeEmptyJsonLdValues(data)).replace(/</g, "\\u003c");
}

function buildBaseSalaryBlock(salaryMin: number | null, salaryMax: number | null) {
  const min = typeof salaryMin === "number" && Number.isFinite(salaryMin) && salaryMin > 0 ? salaryMin : null;
  const max = typeof salaryMax === "number" && Number.isFinite(salaryMax) && salaryMax > 0 ? salaryMax : null;
  if (!min && !max) return null;

  let qv: Record<string, unknown>;
  if (min && max && min !== max) {
    qv = { "@type": "QuantitativeValue", minValue: min, maxValue: max, unitText: "MONTH" };
  } else {
    qv = { "@type": "QuantitativeValue", value: min ?? max, unitText: "MONTH" };
  }

  return {
    "@type": "MonetaryAmount",
    currency: "BRL",
    value: qv
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

async function buildJobLocationBlock(job: JobPostingJsonLdInput) {
  const resolvedUf = resolveBrazilUfFromJobState(job.stateCode, job.stateName);
  const stateForPostal = resolvedUf ?? job.stateCode.trim();
  const postal =
    job.postalCode?.trim() ||
    (await getReferencePostalCodeForCity({ stateCode: stateForPostal || job.stateCode, citySlug: job.citySlug }));
  const street = job.streetAddress?.trim();

  const address: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality: job.cityName.trim(),
    addressRegion: resolvedUf ?? job.stateCode.trim(),
    addressCountry: { "@type": "Country", name: "Brazil" }
  };

  if (postal && !isPlaceholderSentinel(postal)) {
    address.postalCode = postal;
  }

  if (street && !isPlaceholderStreetAddress(street)) {
    address.streetAddress = street;
  }

  const place: Record<string, unknown> = {
    "@type": "Place",
    address
  };

  const ufForGeo = (resolvedUf ?? job.stateCode.trim()).toUpperCase();
  const geo = getGeoCoordinatesByCityState(job.cityName.trim(), ufForGeo);
  if (geo && Number.isFinite(geo.latitude) && Number.isFinite(geo.longitude)) {
    place.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude
    };
  }

  return place;
}

export async function buildJobPostingJsonLd(job: JobPostingJsonLdInput): Promise<Record<string, unknown> | null> {
  const stored = job.storedTitle.trim();
  const schemaPostingTitle = (job.jobTitle?.trim() || extractJobTitle(stored)).trim() || job.displayTitle.trim();

  const descriptionHtml = cleanJobDescriptionForSchema(job.descriptionHtml, {
    slug: job.slug,
    id: job.id,
    title: stored
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

  const employmentTypeRaw = employmentTypeToSchemaValue(job.employmentType, { title: schemaPostingTitle });
  const jobUrl = absoluteUrl(`/vagas/${job.slug}`);

  const hiringOrganization: Record<string, unknown> = {
    "@type": "Organization",
    name: job.companyName,
    logo: resolveHiringOrganizationLogo(job.companyLogoUrl),
    sameAs: jobUrl
  };

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: schemaPostingTitle,
    url: jobUrl,
    identifier: {
      "@type": "PropertyValue",
      name: siteConfig.name,
      value: (job.externalId?.trim() || job.id || job.slug).trim()
    },
    datePosted: datePostedRaw,
    validThrough: validThroughRaw,
    employmentType: employmentTypeRaw,
    hiringOrganization,
    jobLocation: await buildJobLocationBlock(job),
    description: descriptionHtml,
    directApply: false
  };

  const baseSalary = buildBaseSalaryBlock(job.salaryMin, job.salaryMax);
  if (baseSalary) {
    data.baseSalary = baseSalary;
  }

  const cleaned = removeEmptyJsonLdValues(data) as Record<string, unknown>;

  const validation = validateJobPostingMinimum({
    displayTitle: schemaPostingTitle,
    descriptionHtml: String(cleaned.description ?? ""),
    datePosted: String(cleaned.datePosted ?? ""),
    validThrough: String(cleaned.validThrough ?? ""),
    employmentType: job.employmentType,
    companyName: job.companyName,
    cityName: job.cityName,
    stateCode: job.stateCode,
    countryCode: (job.countryCode ?? "BR").trim() || "BR"
  });

  if (!validation.ok) {
    return null;
  }

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
