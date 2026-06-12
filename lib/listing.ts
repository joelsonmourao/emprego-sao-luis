import { getCityJobsPath, getCompanyJobsPath, getStateJobsPath } from "@/lib/seo/jobs-pages";

type ListingDescriptorInput = {
  total: number;
  stateName?: string;
  stateCode?: string;
  cityName?: string;
  companyName?: string;
  query?: string;
};

type JobsSearchIndexingInput = {
  total: number;
  query?: string;
  stateSlug?: string;
  citySlug?: string;
  stateCode?: string;
  companySlug?: string;
  order?: "relevance" | "date";
  page?: number;
};

function formatCount(total: number) {
  return `${total} ${total === 1 ? "vaga" : "vagas"}`;
}

function normalizeQuery(query?: string) {
  return query?.trim().replace(/\s+/g, " ") ?? "";
}

export function buildJobsListingHeading(input: ListingDescriptorInput) {
  if (input.companyName) return `Vagas na ${input.companyName}`;
  if (input.cityName && input.stateCode) return `Vagas de emprego em ${input.cityName}, ${input.stateCode}`;
  if (input.stateName) return `Vagas de emprego no ${input.stateName}`;
  return "Vagas de emprego em São Luís e Maranhão";
}

export function buildJobsListingMetaTitle(input: ListingDescriptorInput) {
  if (input.companyName) return `${formatCount(input.total)} na ${input.companyName} - Emprego São Luís`;
  if (input.cityName && input.stateCode) return `Vagas em ${input.cityName}, ${input.stateCode} - Emprego São Luís`;
  if (input.stateName) return `Vagas no ${input.stateName} - Emprego São Luís`;
  return "Vagas em São Luís e Maranhão - Emprego São Luís";
}

export function buildJobsListingDescription(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `Veja ${formatCount(input.total)} divulgadas pela ${input.companyName} no Emprego São Luís.`;
  }
  if (input.cityName && input.stateCode) {
    return `Procure vagas de emprego em ${input.cityName}, ${input.stateCode}. ${formatCount(input.total)} disponíveis no portal.`;
  }
  if (input.stateName) {
    return `Procure vagas de emprego no ${input.stateName}. ${formatCount(input.total)} divulgadas no portal.`;
  }
  return `Encontre vagas de emprego em São Luís e no Maranhão. ${formatCount(input.total)} no portal.`;
}

export function buildJobsListingIntro(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `Confira oportunidades divulgadas pela ${input.companyName} e acesse o link oficial de candidatura em cada vaga.`;
  }
  if (input.cityName && input.stateCode) {
    return `Confira vagas de emprego divulgadas em ${input.cityName}, ${input.stateCode}, com oportunidades atualizadas por empresa e área.`;
  }
  if (input.stateName) {
    return `Encontre vagas de emprego no ${input.stateName}. O Emprego São Luís facilita a busca por oportunidades no estado.`;
  }
  return `Encontre vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão.`;
}

export function isStrategicJobsSearchIndexable(input: JobsSearchIndexingInput) {
  const firstPage = (input.page ?? 1) === 1;
  const relevanceOrder = (input.order ?? "relevance") === "relevance";
  const hasTechnicalFilters = Boolean(normalizeQuery(input.query)) || Boolean(input.stateSlug) || Boolean(input.citySlug) || Boolean(input.companySlug);
  return input.total > 0 && firstPage && relevanceOrder && !hasTechnicalFilters;
}

export function buildJobsSearchCanonicalPath(input: JobsSearchIndexingInput) {
  const query = normalizeQuery(input.query);
  const firstPage = (input.page ?? 1) === 1;
  const defaultOrder = (input.order ?? "relevance") === "relevance";

  if (!query && input.citySlug && firstPage && defaultOrder) {
    return getCityJobsPath(input.citySlug);
  }

  if (!query && input.stateSlug) {
    return getStateJobsPath(input.stateSlug);
  }

  if (!query && input.companySlug) {
    return getCompanyJobsPath(input.companySlug);
  }

  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (input.stateSlug) params.set("estado", input.stateSlug);
  if (input.citySlug) params.set("cidade", input.citySlug);
  if (input.companySlug) params.set("empresa", input.companySlug);
  if (!defaultOrder) params.set("order", input.order ?? "relevance");
  if (!firstPage) params.set("page", String(input.page));
  const qs = params.toString();
  return qs ? `/vagas?${qs}` : "/vagas";
}
