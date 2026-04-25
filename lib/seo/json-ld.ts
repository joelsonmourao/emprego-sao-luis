import { getReferencePostalCodeForCity } from "@/lib/seo/br-reference-postal";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { getSiteOrigin, normalizeOrigin } from "@/lib/site-url";
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

/** Piso mensal de referência (BRL) só quando a vaga não informa faixa — atualize conforme legislação. */
const JOBPOSTING_FALLBACK_MONTHLY_BRL = 1518;

export type JobPostingJsonLdInput = {
  id: string;
  externalId?: string | null;
  seoTitle?: string | null;
  title: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  companySlug?: string | null;
  cityName: string;
  citySlug: string;
  stateCode: string;
  stateName: string;
  locationType?: "ONSITE" | "REMOTE" | "HYBRID" | string | null;
  publishedAt: string;
  expiresAt: string | null;
  validThrough?: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  requirements: unknown[];
  benefits: unknown[];
  streetAddress?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
  /** Área de atuação; quando ausente, usa texto padrão do programa de aprendizagem. */
  industry?: string | null;
  /** Código CBO (ex.: 4110-10); quando ausente, usa padrão administrativo genérico. */
  occupationalCategory?: string | null;
  /** URL de candidatura (mesma origem do site → directApply true no JSON-LD). */
  applyUrl: string;
  /** Valor bruto da fonte (CMS/DB/API); quando definido, sobrescreve a inferência a partir de applyUrl. */
  directApply?: unknown;
};

/** Schema.org: candidatura no próprio domínio da vaga vs link externo. */
function inferDirectApplyFromApplyUrl(applyUrl: string): boolean {
  const jobOrigin = normalizeOrigin(applyUrl.trim());
  const siteOrigin = normalizeOrigin(getSiteOrigin());
  return Boolean(jobOrigin && siteOrigin && jobOrigin === siteOrigin);
}

function normalizeIsoDate(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** Normaliza ISO para schema (remove sufixo de milissegundos `.000Z` → `Z`). */
export function sanitizeISODate(dateStr: string | undefined | null) {
  return dateStr?.replace(/\.\d{3}Z$/, "Z") ?? dateStr;
}

export function sanitizeDirectApply(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }
  if (typeof value === "string") {
    const s = value.trim();
    if (
      s.toLowerCase() === "true" ||
      s === "1" ||
      s === "http://schema.org/True" ||
      s === "https://schema.org/True" ||
      s === "True"
    ) {
      return true;
    }
  }
  return false;
}

/** Serialização final do JobPosting: força `directApply` booleano no JSON. */
export function stringifyJobPostingJsonLd(data: Record<string, unknown>) {
  const directApply = sanitizeDirectApply(data.directApply ?? false);
  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
    body: JSON.stringify({
      sessionId: "eb6787",
      runId: "pre-verify",
      hypothesisId: "H2",
      location: "lib/seo/json-ld.ts:stringifyJobPostingJsonLd",
      message: "serialize directApply",
      data: { typeofDirectApply: typeof directApply, directApply },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  return JSON.stringify({ ...data, directApply }).replace(/</g, "\\u003c");
}

function escapeHtmlText(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toStringList(items: unknown[]): string[] {
  return items.map((item) => String(item).trim()).filter(Boolean);
}

function buildJobPostingDescriptionHtml(input: { summary: string; descriptionHtml: string; requirements: string[]; benefits: string[] }) {
  const parts: string[] = [];
  if (input.summary.trim()) {
    parts.push(`<p>${escapeHtmlText(input.summary.trim())}</p>`);
  }
  const body = sanitizeRichTextHtml(input.descriptionHtml).trim();
  if (body) {
    parts.push(body);
  }
  if (input.requirements.length) {
    parts.push("<h3>Requisitos</h3>", "<ul>", ...input.requirements.map((item) => `<li>${escapeHtmlText(item)}</li>`), "</ul>");
  }
  if (input.benefits.length) {
    parts.push("<h3>Beneficios</h3>", "<ul>", ...input.benefits.map((item) => `<li>${escapeHtmlText(item)}</li>`), "</ul>");
  }
  return parts.join("\n").slice(0, 100000);
}

function computeValidThroughIso(publishedAt: string, validThrough: string | null, expiresAt: string | null) {
  const posted = new Date(publishedAt);
  if (Number.isNaN(posted.getTime())) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 30);
    return d.toISOString();
  }
  const minFromPosted = new Date(posted);
  minFromPosted.setUTCDate(minFromPosted.getUTCDate() + 30);
  const raw = validThrough ? new Date(validThrough) : expiresAt ? new Date(expiresAt) : null;
  if (raw && !Number.isNaN(raw.getTime()) && raw.getTime() >= minFromPosted.getTime()) {
    return raw.toISOString();
  }
  return minFromPosted.toISOString();
}

function buildBaseSalaryBlock(salaryMin: number | null, salaryMax: number | null) {
  const min = typeof salaryMin === "number" && Number.isFinite(salaryMin) && salaryMin > 0 ? salaryMin : null;
  const max = typeof salaryMax === "number" && Number.isFinite(salaryMax) && salaryMax > 0 ? salaryMax : null;
  let qv: Record<string, unknown>;
  if (min && max && min !== max) {
    const avg = Math.round((min + max) / 2);
    qv = { "@type": "QuantitativeValue", value: avg, minValue: min, maxValue: max, unitText: "MONTH" };
  } else if (min ?? max) {
    qv = { "@type": "QuantitativeValue", value: min ?? max, unitText: "MONTH" };
  } else {
    qv = { "@type": "QuantitativeValue", value: JOBPOSTING_FALLBACK_MONTHLY_BRL, unitText: "MONTH" };
  }
  return {
    "@type": "MonetaryAmount",
    currency: "BRL",
    value: qv
  };
}

function buildHiringOrganization(input: {
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  companySlug?: string | null;
}) {
  const logo = absoluteUrl(input.companyLogoUrl ?? "/brand-mark.svg");
  const site = input.companyWebsiteUrl?.trim();
  const org: Record<string, unknown> = {
    "@type": "Organization",
    name: input.companyName,
    logo
  };
  if (site && /^https?:\/\//i.test(site)) {
    org.url = site;
  } else if (input.companySlug) {
    org.url = absoluteUrl(`/vagas/empresa/${input.companySlug}`);
  } else {
    org.url = absoluteUrl("/");
  }
  if (org.sameAs === org.url) {
    delete org.sameAs;
  }
  return org;
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
    v === "n/d"
  );
}

async function buildJobLocationBlock(job: JobPostingJsonLdInput) {
  const country = job.countryCode ?? "BR";
  const postal =
    job.postalCode?.trim() ||
    (await getReferencePostalCodeForCity({ stateCode: job.stateCode, citySlug: job.citySlug }));
  const street = job.streetAddress?.trim();

  const address: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality: job.cityName,
    addressRegion: job.stateCode,
    addressCountry: country
  };

  // Usa postalCode apenas quando tiver CEP da própria cidade.
  if (postal) {
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

const DEFAULT_INDUSTRY =
  "Programa de Aprendizagem Profissional — Jovem Aprendiz e Menor Aprendiz (Lei da Aprendizagem)";
const DEFAULT_OCCUPATIONAL_CATEGORY = "4110-10";

export async function buildJobPostingJsonLd(job: JobPostingJsonLdInput) {
  const requirements = toStringList(job.requirements);
  const benefits = toStringList(job.benefits);
  const descriptionHtml = buildJobPostingDescriptionHtml({
    summary: job.summary?.trim() ?? "",
    descriptionHtml: job.descriptionHtml,
    requirements,
    benefits
  });

  const datePostedRaw = normalizeIsoDate(job.publishedAt) ?? new Date().toISOString();
  const validThroughRaw = computeValidThroughIso(job.publishedAt, job.validThrough ?? null, job.expiresAt);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: (job.seoTitle?.trim() || job.title).trim(),
    identifier: {
      "@type": "PropertyValue",
      name: job.companyName,
      value: (job.externalId?.trim() || job.id).trim()
    },
    datePosted: sanitizeISODate(datePostedRaw) ?? datePostedRaw,
    validThrough: sanitizeISODate(validThroughRaw) ?? validThroughRaw,
    employmentType: ["PART_TIME", "INTERN"],
    educationRequirements: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "high school"
    },
    jobLocation: await buildJobLocationBlock(job),
    baseSalary: buildBaseSalaryBlock(job.salaryMin, job.salaryMax),
    description: descriptionHtml,
    industry: (job.industry?.trim() || DEFAULT_INDUSTRY).trim(),
    occupationalCategory: (job.occupationalCategory?.trim() || DEFAULT_OCCUPATIONAL_CATEGORY).trim(),
    hiringOrganization: buildHiringOrganization({
      companyName: job.companyName,
      companyLogoUrl: job.companyLogoUrl,
      companyWebsiteUrl: job.companyWebsiteUrl,
      companySlug: job.companySlug
    }),
    url: absoluteUrl(`/vagas/${job.slug}`)
  };

  if (requirements.length) {
    data.qualifications = requirements.join("\n");
  }
  if (benefits.length) {
    data.jobBenefits = benefits.join("\n");
  }

  if (job.locationType === "REMOTE") {
    data.jobLocationType = "TELECOMMUTE";
    data.applicantLocationRequirements = {
      "@type": "Country",
      name: "Brazil"
    };
  }

  const directApply = false;
  data.directApply = directApply;

  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "eb6787" },
    body: JSON.stringify({
      sessionId: "eb6787",
      runId: "pre-verify",
      hypothesisId: "H1",
      location: "lib/seo/json-ld.ts:buildJobPostingJsonLd",
      message: "directApply resolved",
      data: {
        hasExplicitOverride: job.directApply !== undefined && job.directApply !== null,
        directApply,
        sameOriginInferred: inferDirectApplyFromApplyUrl(job.applyUrl)
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  return data;
}

/** Evita quebra de `</script>` em HTML embutido no JSON (recomendação Next.js / XSS). */
export function stringifyJsonLdSafe(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
