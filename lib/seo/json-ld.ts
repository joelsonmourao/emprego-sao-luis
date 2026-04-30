import type { EmploymentType } from "@prisma/client";

import { normalizeDatePostedForSchema, normalizeValidThroughSchemaString } from "@/lib/date-utils";
import { buildJobPostingDescriptionHtml } from "@/lib/jobs/job-posting-description";
import { validateJobPostingMinimum } from "@/lib/jobs/job-posting-validate";
import { employmentTypeToSchemaValue } from "@/lib/jobs/employment-type";
import { getReferencePostalCodeForCity } from "@/lib/seo/br-reference-postal";
import { buildJobPublisherName } from "@/lib/seo/job-publisher";
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

export type JobPostingJsonLdInput = {
  id: string;
  externalId?: string | null;
  seoTitle?: string | null;
  /** Título público já resolvido (cargo em Cidade UF quando necessário). */
  displayTitle: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  cityName: string;
  citySlug: string;
  stateCode: string;
  stateName: string;
  locationType?: "ONSITE" | "REMOTE" | "HYBRID" | string | null;
  publishedAt: string | Date;
  updatedAt?: string | Date | null;
  expiresAt: string | Date | null;
  validThrough?: string | Date | null;
  salaryMin: number | null;
  salaryMax: number | null;
  requirements: unknown[];
  benefits: unknown[];
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
  const country = (job.countryCode ?? "BR").trim() || "BR";
  const postal = job.postalCode?.trim() || (await getReferencePostalCodeForCity({ stateCode: job.stateCode, citySlug: job.citySlug }));
  const street = job.streetAddress?.trim();

  const address: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality: job.cityName,
    addressRegion: job.stateCode,
    addressCountry: country.length === 2 ? country : "BR"
  };

  if (postal && !isPlaceholderSentinel(postal)) {
    address.postalCode = postal;
  }

  if (street && !isPlaceholderStreetAddress(street)) {
    address.streetAddress = street;
  }

  return {
    "@type": "Place",
    address
  };
}

export async function buildJobPostingJsonLd(job: JobPostingJsonLdInput): Promise<Record<string, unknown> | null> {
  const descriptionHtml = buildJobPostingDescriptionHtml({
    displayTitle: job.displayTitle,
    companyName: job.companyName,
    cityName: job.cityName,
    stateCode: job.stateCode,
    summary: job.summary?.trim() ?? "",
    descriptionHtml: job.descriptionHtml,
    requirements: job.requirements,
    benefits: job.benefits,
    workHours: job.workHours
  });

  const datePostedRaw =
    normalizeDatePostedForSchema(job.updatedAt ?? null) ??
    normalizeDatePostedForSchema(job.publishedAt) ??
    normalizeDatePostedForSchema(new Date())!;
  const validThroughRaw = normalizeValidThroughSchemaString({
    publishedAt: job.publishedAt,
    validThrough: job.validThrough ?? null,
    expiresAt: job.expiresAt
  });

  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "jobposting-tz",
      hypothesisId: "H_TZ_LD",
      location: "lib/seo/json-ld.ts",
      message: "JobPosting datePosted e validThrough normalizados (BR)",
      data: { slug: job.slug, datePostedRaw, validThroughRaw },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  const employmentTypeRaw = employmentTypeToSchemaValue(job.employmentType, { title: job.displayTitle });
  const jobUrl = absoluteUrl(`/vagas/${job.slug}`);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.displayTitle.trim(),
    url: jobUrl,
    identifier: {
      "@type": "PropertyValue",
      name: buildJobPublisherName(job.cityName, job.stateCode),
      value: (job.externalId?.trim() || job.id || job.slug).trim()
    },
    datePosted: datePostedRaw,
    validThrough: validThroughRaw,
    employmentType: employmentTypeRaw,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: "https://slzcontent.com.br/icon.svg",
      sameAs: jobUrl
    },
    jobLocation: await buildJobLocationBlock(job),
    description: descriptionHtml
  };

  const baseSalary = buildBaseSalaryBlock(job.salaryMin, job.salaryMax);
  if (baseSalary) {
    data.baseSalary = baseSalary;
  }

  const cleaned = removeEmptyJsonLdValues(data) as Record<string, unknown>;

  const validation = validateJobPostingMinimum({
    displayTitle: String(cleaned.title ?? ""),
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
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "jobposting-validate",
        hypothesisId: "H_VAL",
        location: "lib/seo/json-ld.ts",
        message: "JobPosting schema omitido por validacao minima",
        data: { slug: job.slug, reason: validation.reason },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return null;
  }

  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "jobposting-ok",
      hypothesisId: "H_LD",
      location: "lib/seo/json-ld.ts",
      message: "JobPosting schema montado",
      data: {
        slug: job.slug,
        keys: Object.keys(cleaned),
        employmentType: cleaned.employmentType,
        hasBaseSalary: Boolean(cleaned.baseSalary),
        hiringOrganization: cleaned.hiringOrganization
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

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
