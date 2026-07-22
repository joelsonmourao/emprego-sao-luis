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
  /** Logo do site (ou empresa) — vira hiringOrganization.logo */
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

function absoluteAssetUrl(url: string | null | undefined): string | undefined {
  const value = String(url ?? "").trim();
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  const base = (process.env.SITE_URL || "https://empregossaoluis.com.br").replace(/\/$/, "");
  return value.startsWith("/") ? `${base}${value}` : `${base}/${value}`;
}

const DEFAULT_ORG_LOGOS = ["/brand/icon.webp", "/favicon.svg"] as const;

export function buildJobPosting(input: JobPostingInput) {
  if (
    (input.publicationStatus && input.publicationStatus !== "PUBLISHED") ||
    !input.publishedAt ||
    !input.expiresAt ||
    input.expiresAt <= new Date() ||
    input.confidentialCompany ||
    input.unidentifiedCompany ||
    input.organizationPubliclyIdentifiable === false ||
    !input.companyName.trim()
  )
    return null;
  const salaryMin = input.salaryMin != null && String(input.salaryMin).trim() !== ""
    ? Number(input.salaryMin)
    : undefined;
  const salaryMax = input.salaryMax != null && String(input.salaryMax).trim() !== ""
    ? Number(input.salaryMax)
    : undefined;
  const hasSalaryNumber =
    Boolean(input.salaryVisible) &&
    ((salaryMin !== undefined && Number.isFinite(salaryMin)) ||
      (salaryMax !== undefined && Number.isFinite(salaryMax)));
  // Google espera MonetaryAmount.value = número OU QuantitativeValue.
  // Sem salário informado: value fica direto em MonetaryAmount (não aninhado).
  const baseSalary = hasSalaryNumber
    ? {
        "@type": "MonetaryAmount",
        currency: input.salaryCurrency || "BRL",
        value: {
          "@type": "QuantitativeValue",
          ...(salaryMin !== undefined && Number.isFinite(salaryMin) ? { minValue: salaryMin } : {}),
          ...(salaryMax !== undefined && Number.isFinite(salaryMax) ? { maxValue: salaryMax } : {}),
          ...(salaryMin !== undefined &&
          Number.isFinite(salaryMin) &&
          (salaryMax === undefined || !Number.isFinite(salaryMax))
            ? { value: salaryMin }
            : {}),
          ...(salaryMax !== undefined &&
          Number.isFinite(salaryMax) &&
          (salaryMin === undefined || !Number.isFinite(salaryMin))
            ? { value: salaryMax }
            : {}),
          unitText: input.salaryPeriod || "MONTH"
        }
      }
    : {
        "@type": "MonetaryAmount",
        currency: input.salaryCurrency || "BRL",
        value: 0
      };
  const brandLogos = DEFAULT_ORG_LOGOS.map((path) => ({
    "@type": "ImageObject" as const,
    url: absoluteAssetUrl(path)!
  }));
  const identifierValue = input.publicCode?.trim() ? input.publicCode.trim() : 0;
  const streetAddress = input.streetAddress?.trim() || "Não Informado";
  const postalCode = input.postalCode?.trim() || "Não Informado";
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    // Google JobPosting: description em HTML (não Markdown).
    description: input.description,
    datePosted: input.publishedAt.toISOString(),
    validThrough: input.expiresAt.toISOString(),
    employmentType: input.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: input.companyName,
      ...(input.companyWebsiteUrl ? { sameAs: input.companyWebsiteUrl } : {}),
      logo: brandLogos
    },
    identifier: { "@type": "PropertyValue", name: "Código ES", value: identifierValue },
    ...(input.canonicalUrl ? { url: input.canonicalUrl } : {}),
    ...(input.workplaceType === "remoto"
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "BR" } }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress,
              postalCode,
              addressLocality: input.cityName || "Não Informado",
              addressRegion: input.stateCode || "Não Informado",
              addressCountry: "BR"
            }
          }
        }),
    baseSalary,
    ...(input.directApply === true ? { directApply: true } : {})
  };
}

export function validateJobPosting(input: JobPostingInput) {
  const missing: string[] = [];
  if (!input.title.trim()) missing.push("title");
  if (!input.description.trim()) missing.push("description");
  if (!input.publishedAt) missing.push("datePosted");
  if (!input.expiresAt) missing.push("validThrough");
  if (!input.employmentType.trim()) missing.push("employmentType");
  if (!input.companyName.trim()) missing.push("hiringOrganization");
  if (
    input.confidentialCompany ||
    input.unidentifiedCompany ||
    input.organizationPubliclyIdentifiable === false
  )
    missing.push("publicHiringOrganization");
  if (input.publicationStatus && input.publicationStatus !== "PUBLISHED") missing.push("publicationStatus");
  if (input.workplaceType !== "remoto" && (!input.cityName.trim() || !input.stateCode.trim()))
    missing.push("jobLocation");
  if (!input.canonicalUrl?.trim()) missing.push("canonicalUrl");
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
