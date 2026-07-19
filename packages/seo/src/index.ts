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
  const showSalary = input.salaryVisible && (input.salaryMin || input.salaryMax);
  const baseSalary = showSalary
    ? {
        "@type": "MonetaryAmount",
        currency: input.salaryCurrency,
        value: {
          "@type": "QuantitativeValue",
          ...(input.salaryMin ? { minValue: Number(input.salaryMin) } : {}),
          ...(input.salaryMax ? { maxValue: Number(input.salaryMax) } : {}),
          ...(input.salaryPeriod ? { unitText: input.salaryPeriod } : {})
        }
      }
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.publishedAt.toISOString(),
    validThrough: input.expiresAt.toISOString(),
    employmentType: input.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: input.companyName,
      ...(input.companyWebsiteUrl ? { sameAs: input.companyWebsiteUrl } : {})
    },
    ...(input.publicCode
      ? { identifier: { "@type": "PropertyValue", name: "Código ES", value: input.publicCode } }
      : {}),
    ...(input.canonicalUrl ? { url: input.canonicalUrl } : {}),
    ...(input.workplaceType === "remoto"
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "BR" } }
      : {
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: input.cityName,
              addressRegion: input.stateCode,
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
  if (!input.publicCode?.trim()) missing.push("identifier");
  if (!input.canonicalUrl?.trim()) missing.push("canonicalUrl");
  if (input.salaryVisible && !input.salaryMin && !input.salaryMax) missing.push("baseSalary");
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
