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
  stateName: string;
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
  return {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      streetAddress: job.streetAddress ?? "Indefinido",
      postalCode: job.postalCode ?? "Indefinido",
      addressLocality: `${job.cityName}, ${job.stateName}`,
      addressRegion: `${job.cityName}, ${job.stateName}`,
      addressCountry: job.countryCode ?? "BR"
    }
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
  };

  const validThrough = normalizeIsoDate(job.validThrough ?? job.expiresAt);
  if (validThrough) {
    data.validThrough = validThrough;
  }

  const baseSalary = buildSalaryBlock(job);
  if (baseSalary) {
    data.baseSalary = baseSalary;
  }

  data.title = job.title;
  data.description = description;
  data.employmentType = job.employmentType;
  data.hiringOrganization = {
    "@type": "Organization",
    name: job.companyName,
    logo: absoluteUrl(job.companyLogoUrl ?? "/brand-mark.svg")
  };
  data.identifier = {
    "@type": "PropertyValue",
    name: job.companyName,
    value: absoluteUrl(`/vagas/${job.slug}`)
  };
  data.jobLocation = buildJobLocation(job);

  return data;
}

export async function buildJobPostingJsonLdAsync(job: JobPostingInput) {
  return buildJobPostingJsonLd(job);
}
