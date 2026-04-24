import { getReferencePostalCodeForCity } from "@/lib/seo/br-reference-postal";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
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
};

function normalizeIsoDate(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** Normaliza ISO para schema (remove sufixo de milissegundos `.000Z` → `Z`). */
function sanitizeISODate(dateStr: string | undefined | null) {
  return dateStr?.replace(/\.\d{3}Z$/, "Z") ?? dateStr;
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

  address.streetAddress = street || "Indefinido";

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
    employmentType: "PART_TIME",
    educationRequirements: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "high school"
    },
    jobLocation: await buildJobLocationBlock(job),
    baseSalary: buildBaseSalaryBlock(job.salaryMin, job.salaryMax),
    description: descriptionHtml,
    /** Selo de candidatura rápida no Google; exige fluxo de candidatura compatível com a política do Google. */
    directApply: true,
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

  return data;
}

/** Evita quebra de `</script>` em HTML embutido no JSON (recomendação Next.js / XSS). */
export function stringifyJsonLdSafe(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
