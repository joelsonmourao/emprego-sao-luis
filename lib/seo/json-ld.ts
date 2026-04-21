import { absoluteUrl } from "@/lib/utils";
import { stripHtml } from "@/lib/rich-text";

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

type JobPostingInput = {
  id?: string;
  externalId?: string | null;
  title: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  cityName: string;
  stateCode: string;
  publishedAt: string;
  expiresAt: string | null;
  validThrough?: string | null;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  countryCode?: string | null;
};

function normalizeIsoDate(value?: string | null) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function buildSalaryBlock(job: JobPostingInput) {
  const numericValues = [job.salaryMin, job.salaryMax].filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);

  if (!numericValues.length) {
    return undefined;
  }

  const value = job.salaryMin && job.salaryMax && job.salaryMin === job.salaryMax ? job.salaryMin : Math.min(...numericValues);

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

function buildJobLocation(job: JobPostingInput) {
  const address: Record<string, unknown> = {
    "@type": "PostalAddress"
  };

  if (job.streetAddress) {
    address.streetAddress = job.streetAddress;
  }

  if (job.postalCode) {
    address.postalCode = job.postalCode;
  }

  if (job.cityName) {
    address.addressLocality = job.cityName;
  }

  if (job.stateCode) {
    address.addressRegion = job.stateCode;
  }

  address.addressCountry = job.countryCode ?? "BR";

  return {
    "@type": "Place",
    address
  };
}

export function buildJobPostingJsonLd(job: JobPostingInput) {
  const description = [job.summary?.trim(), stripHtml(job.descriptionHtml).trim()]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 5000);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    datePosted: normalizeIsoDate(job.publishedAt),
    title: job.title,
    description,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      ...(job.companyLogoUrl ? { logo: absoluteUrl(job.companyLogoUrl) } : {})
    },
    identifier: {
      "@type": "PropertyValue",
      name: job.companyName,
      value: job.externalId || job.id || job.slug
    },
    jobLocation: buildJobLocation(job)
  };

  const validThrough = normalizeIsoDate(job.validThrough ?? job.expiresAt);
  if (validThrough) {
    data.validThrough = validThrough;
  }

  const baseSalary = buildSalaryBlock(job);
  if (baseSalary) {
    data.baseSalary = baseSalary;
  }

  return data;
}

export async function buildJobPostingJsonLdAsync(job: JobPostingInput) {
  return buildJobPostingJsonLd(job);
}
