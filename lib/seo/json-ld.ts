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

// Mapeamento de CEPs por cidade para fallback automático
const CITY_CEP_MAP: Record<string, string> = {
  "são luís": "65000-000",
  "são luis": "65000-000",
  "são paulo": "01000-000",
  "sao paulo": "01000-000",
  "rio de janeiro": "20000-000",
  "belo horizonte": "30000-000",
  "brasília": "70000-000",
  "recife": "50000-000",
  "salvador": "40000-000",
  "fortaleza": "60000-000",
  "manaus": "69000-000",
  "curitiba": "80000-000",
  "porto alegre": "90000-000"
};

// Função para obter CEP baseado na cidade
function getCityPostalCode(cityName: string): string {
  const normalizedCity = cityName.toLowerCase().trim();
  return CITY_CEP_MAP[normalizedCity] || "00000-000"; // Fallback genérico
}

// Função para gerar streetAddress com fallbacks
function generateStreetAddress(cityName: string): string {
  // Se tiver informações mais específicas da localização, usaríamos aqui
  // Por enquanto, usa uma abordagem baseada na cidade
  const normalizedCity = cityName.toLowerCase().trim();
  
  // Para São Luís, usamos bairros conhecidos ou fallback genérico
  if (normalizedCity.includes("são luís") || normalizedCity.includes("sao luis")) {
    return "Centro Histórico, São Luís, MA";
  }
  
  // Para outras cidades, usa centro ou bairro genérico
  return `Centro, ${cityName}`;
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
              streetAddress: generateStreetAddress(job.cityName),
              addressLocality: job.cityName,
              addressRegion: job.stateCode,
              postalCode: getCityPostalCode(job.cityName),
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
