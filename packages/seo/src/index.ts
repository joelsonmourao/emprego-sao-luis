export const SITE_NAME = "Empregos São Luís";

export {
  buildBreadcrumbSchema,
  buildOpenGraphTags,
  buildOrganizationSchema,
  buildTwitterTags,
  buildWebSiteSchema
} from "./metadata.js";
export {
  buildSitemapIndex,
  buildUrlSet,
  chunkEntries,
  dedupeEntries,
  normalizeLastmod,
  SITEMAP_CHUNK_SIZE,
  type SitemapEntry
} from "./sitemaps.js";
export { defaultSeoSettings, mergeSeoSettings, seoSettingsSchema, type SeoSettings } from "./settings.js";

export interface JobPostingInput {
  title: string;
  description: string;
  publishedAt: Date | null;
  expiresAt: Date | null;
  employmentType: string;
  workplaceType: string;
  companyName: string;
  companyWebsiteUrl?: string | null;
  organizationLogoUrl?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  cityName: string;
  stateCode: string;
  applicationUrl?: string | null;
  applicationType?: string;
  salaryMin?: string | null;
  salaryMax?: string | null;
  salaryCurrency: string;
  salaryPeriod?: string | null;
  salaryVisible?: boolean;
  publicCode?: string;
  canonicalUrl?: string;
  publicationStatus?: string;
  confidentialCompany?: boolean;
  unidentifiedCompany?: boolean;
  organizationPubliclyIdentifiable?: boolean;
  directApply?: boolean;
}

function absoluteHttpUrl(url: string | null | undefined): string | undefined {
  const value = String(url ?? "").trim();
  if (!value) return undefined;
  try {
    const configured = process.env.SITE_URL?.trim();
    let base = "https://empregossaoluis.com.br";
    if (configured) {
      try {
        const parsed = new URL(configured);
        if (
          (parsed.protocol === "http:" || parsed.protocol === "https:") &&
          !["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)
        ) {
          base = parsed.origin;
        }
      } catch {
        // keep production base
      }
    }
    const resolved = new URL(value, base);
    if (!["http:", "https:"].includes(resolved.protocol)) return undefined;
    if (["localhost", "127.0.0.1", "::1"].includes(resolved.hostname)) return undefined;
    return resolved.toString();
  } catch {
    return undefined;
  }
}

const normalizeToken = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

const EMPLOYMENT_TYPES = new Set([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACTOR",
  "TEMPORARY",
  "INTERN",
  "VOLUNTEER",
  "PER_DIEM",
  "OTHER"
]);

export function normalizeEmploymentType(value: string): string | undefined {
  const normalized = normalizeToken(String(value ?? ""));
  if (EMPLOYMENT_TYPES.has(normalized)) return normalized;
  if (["CLT", "INTEGRAL", "TEMPO_INTEGRAL", "EFETIVO"].includes(normalized)) return "FULL_TIME";
  if (["PARCIAL", "MEIO_PERIODO", "TEMPO_PARCIAL"].includes(normalized)) return "PART_TIME";
  if (["TEMPORARIO", "SAFRISTA"].includes(normalized)) return "TEMPORARY";
  if (["ESTAGIO", "APRENDIZ", "JOVEM_APRENDIZ"].includes(normalized)) return "INTERN";
  if (["PJ", "AUTONOMO", "PRESTADOR_DE_SERVICOS", "CONTRATO"].includes(normalized)) return "CONTRACTOR";
  if (["DIARISTA", "POR_DIA"].includes(normalized)) return "PER_DIEM";
  if (["VOLUNTARIO"].includes(normalized)) return "VOLUNTEER";
  if (["INTERMITENTE", "OUTRO"].includes(normalized)) return "OTHER";
  return undefined;
}

function normalizeSalaryUnit(value: string | null | undefined): string | undefined {
  const normalized = normalizeToken(String(value ?? ""));
  const units: Record<string, string> = {
    HOUR: "HOUR",
    HORA: "HOUR",
    DAY: "DAY",
    DIA: "DAY",
    WEEK: "WEEK",
    SEMANA: "WEEK",
    MONTH: "MONTH",
    MES: "MONTH",
    YEAR: "YEAR",
    ANO: "YEAR"
  };
  return units[normalized];
}

export function buildJobPosting(input: JobPostingInput) {
  const title = String(input.title ?? "").trim();
  const description = String(input.description ?? "").trim();
  const companyName = String(input.companyName ?? "").trim();
  const employmentType = normalizeEmploymentType(input.employmentType);
  const remote = ["REMOTO", "REMOTE"].includes(normalizeToken(input.workplaceType));
  const cityName = String(input.cityName ?? "").trim();
  const stateCode = String(input.stateCode ?? "").trim().toUpperCase();
  const invalidCity = /^(não informado|nao informado|a definir|desconhecida|cidade)$/i.test(cityName);
  const canonicalUrl = absoluteHttpUrl(input.canonicalUrl);
  if (
    (input.publicationStatus && input.publicationStatus !== "PUBLISHED") ||
    !input.publishedAt ||
    !input.expiresAt ||
    input.expiresAt <= new Date() ||
    input.confidentialCompany ||
    input.unidentifiedCompany ||
    input.organizationPubliclyIdentifiable === false ||
    !title ||
    !description ||
    !companyName ||
    !employmentType ||
    !canonicalUrl ||
    (!remote && (!cityName || invalidCity || !/^[A-Z]{2}$/.test(stateCode)))
  ) {
    return null;
  }

  const salaryMin =
    input.salaryMin != null && String(input.salaryMin).trim() !== "" ? Number(input.salaryMin) : undefined;
  const salaryMax =
    input.salaryMax != null && String(input.salaryMax).trim() !== "" ? Number(input.salaryMax) : undefined;
  const validMin = salaryMin !== undefined && Number.isFinite(salaryMin) && salaryMin > 0 ? salaryMin : undefined;
  const validMax = salaryMax !== undefined && Number.isFinite(salaryMax) && salaryMax > 0 ? salaryMax : undefined;
  const hasSalaryNumber = Boolean(input.salaryVisible) && (validMin !== undefined || validMax !== undefined);
  const unitText = normalizeSalaryUnit(input.salaryPeriod);
  const currency = String(input.salaryCurrency ?? "").trim().toUpperCase();
  const baseSalary =
    hasSalaryNumber && unitText && /^[A-Z]{3}$/.test(currency)
      ? {
          "@type": "MonetaryAmount",
          currency,
          value: {
            "@type": "QuantitativeValue",
            ...(validMin !== undefined ? { minValue: validMin } : {}),
            ...(validMax !== undefined ? { maxValue: validMax } : {}),
            ...(validMin !== undefined && validMax === undefined ? { value: validMin } : {}),
            ...(validMax !== undefined && validMin === undefined ? { value: validMax } : {}),
            ...(validMin !== undefined && validMax !== undefined && validMin === validMax
              ? { value: validMin }
              : {}),
            unitText
          }
        }
      : null;

  const organizationLogo = absoluteHttpUrl(input.organizationLogoUrl);
  const companyWebsiteUrl = absoluteHttpUrl(input.companyWebsiteUrl);
  const identifierValue = input.publicCode?.trim() || null;
  const streetAddress = input.streetAddress?.trim() || null;
  const postalCode = input.postalCode?.trim() || null;

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted: input.publishedAt.toISOString(),
    validThrough: input.expiresAt.toISOString(),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      ...(companyWebsiteUrl ? { sameAs: companyWebsiteUrl } : {}),
      ...(organizationLogo ? { logo: organizationLogo } : {})
    },
    ...(identifierValue
      ? { identifier: { "@type": "PropertyValue", name: "Código ES", value: identifierValue } }
      : {}),
    url: canonicalUrl,
    ...(remote
      ? { jobLocationType: "TELECOMMUTE" }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              ...(streetAddress ? { streetAddress } : {}),
              ...(postalCode ? { postalCode } : {}),
              addressLocality: cityName,
              addressRegion: stateCode,
              addressCountry: "BR"
            }
          }
        }),
    ...(baseSalary ? { baseSalary } : {}),
    ...(input.directApply === true ? { directApply: true } : {})
  };
}

export function validateJobPosting(input: JobPostingInput) {
  const missing: string[] = [];
  if (!String(input.title ?? "").trim()) missing.push("title");
  if (!String(input.description ?? "").trim()) missing.push("description");
  if (!input.publishedAt) missing.push("datePosted");
  if (!input.expiresAt) missing.push("validThrough");
  if (!normalizeEmploymentType(input.employmentType)) missing.push("employmentType");
  if (!String(input.companyName ?? "").trim()) missing.push("hiringOrganization");
  if (
    input.confidentialCompany ||
    input.unidentifiedCompany ||
    input.organizationPubliclyIdentifiable === false
  ) {
    missing.push("publicHiringOrganization");
  }
  if (input.publicationStatus && input.publicationStatus !== "PUBLISHED") missing.push("publicationStatus");
  const remote = ["REMOTO", "REMOTE"].includes(normalizeToken(input.workplaceType));
  const cityName = String(input.cityName ?? "").trim();
  const stateCode = String(input.stateCode ?? "").trim().toUpperCase();
  if (
    !remote &&
    (!cityName ||
      /^(não informado|nao informado|a definir|desconhecida|cidade)$/i.test(cityName) ||
      !/^[A-Z]{2}$/.test(stateCode))
  ) {
    missing.push("jobLocation");
  }
  if (!absoluteHttpUrl(input.canonicalUrl)) missing.push("canonicalUrl");
  const schema = buildJobPosting(input);
  return { valid: missing.length === 0 && schema !== null, missing, schema };
}

export function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
