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

export function buildJobPostingJsonLd(job: {
  id?: string;
  externalId?: string | null;
  title: string;
  summary?: string | null;
  descriptionHtml: string;
  slug: string;
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsiteUrl?: string | null;
  cityName: string;
  stateCode: string;
  publishedAt: string;
  updatedAt?: string;
  expiresAt: string | null;
  applyUrl: string;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  workHours?: string | null;
  requirements?: string[];
  responsibilities?: string[];
}) {
  const description = [job.summary?.trim(), stripHtml(job.descriptionHtml).trim()].filter(Boolean).join("\n\n").slice(0, 5000);
  const sameDomainApply = job.applyUrl.startsWith(absoluteUrl("/"));

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: job.publishedAt,
    dateModified: job.updatedAt ?? job.publishedAt,
    validThrough: job.expiresAt ?? undefined,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      logo: job.companyLogoUrl ?? absoluteUrl("/brand-mark.svg"),
      sameAs: job.companyWebsiteUrl ?? undefined
    },
    jobLocationType: job.locationType === "REMOTE" ? "TELECOMMUTE" : undefined,
    jobLocation:
      job.locationType === "REMOTE"
        ? undefined
        : {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.cityName,
              addressRegion: job.stateCode,
              addressCountry: "BR"
            }
          },
    applicantLocationRequirements:
      job.locationType === "REMOTE"
        ? {
            "@type": "Country",
            name: "Brasil"
          }
        : undefined,
    baseSalary:
      job.salaryMin || job.salaryMax
        ? {
            "@type": "MonetaryAmount",
            currency: "BRL",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin ?? undefined,
              maxValue: job.salaryMax ?? undefined,
              unitText: "MONTH"
            }
          }
        : undefined,
    identifier: {
      "@type": "PropertyValue",
      name: job.companyName,
      value: job.externalId || job.id || job.slug
    },
    occupationalCategory: "Jovem Aprendiz",
    qualifications: job.requirements?.length ? job.requirements.join("\n") : undefined,
    responsibilities: job.responsibilities?.length ? job.responsibilities.join("\n") : undefined,
    workHours: job.workHours ?? undefined,
    directApply: sameDomainApply || undefined,
    url: absoluteUrl(`/vagas/${job.slug}`)
  };
}
