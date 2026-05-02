import { buildJovemAprendizCityUfPath } from "@/lib/seo/jovem-aprendiz-city-uf-slug";
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
  /** Sigla UF (ex.: MA) — usada na URL compacta `/vagas/jovem-aprendiz/{cidade}-{uf}`. */
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

function capitalizeWords(value: string) {
  return value.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
}

function buildOpportunity(query?: string) {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return "Jovem Aprendiz";
  }

  const display = capitalizeWords(normalized);
  return /jovem aprendiz/i.test(normalized) ? display : `Jovem Aprendiz ${display}`;
}

export function buildJobsListingHeading(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `Jovem Aprendiz no ${input.companyName}`;
  }

  if (input.cityName && input.stateCode) {
    return `Vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}`;
  }

  if (input.stateName) {
    return `Vagas de Jovem Aprendiz no ${input.stateName}`;
  }

  return "Vagas de Jovem Aprendiz";
}

export function buildJobsListingMetaTitle(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `${formatCount(input.total)} de ${buildOpportunity(input.query)} no ${input.companyName}`;
  }

  if (input.cityName && input.stateCode) {
    return `${formatCount(input.total)} de ${buildOpportunity(input.query)} em ${input.cityName}, ${input.stateCode}`;
  }

  if (input.stateName) {
    return `${formatCount(input.total)} de ${buildOpportunity(input.query)} no ${input.stateName}`;
  }

  return `${formatCount(input.total)} de Jovem Aprendiz no Brasil`;
}

export function buildJobsListingDescription(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `Veja vagas de Jovem Aprendiz no ${input.companyName}, requisitos mais comuns, perfil buscado e como se candidatar às oportunidades.`;
  }

  if (input.cityName && input.stateCode) {
    return `Procure vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}. Veja empresas, requisitos e ${formatCount(
      input.total
    )} abertas para candidatura.`;
  }

  if (input.stateName) {
    return `Procure vagas de Jovem Aprendiz no ${input.stateName}. Veja empresas contratando, requisitos e ${formatCount(
      input.total
    )} abertas para candidatura.`;
  }

  return `Procure vagas de Jovem Aprendiz no Brasil. Veja empresas contratando, requisitos e ${formatCount(
    input.total
  )} abertas para candidatura.`;
}

export function buildJobsListingIntro(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `Confira oportunidades de Jovem Aprendiz no ${input.companyName}, veja requisitos frequentes, cidades com vagas e orientações para acompanhar novas oportunidades.`;
  }

  if (input.cityName && input.stateCode) {
    return `Confira vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}, com oportunidades atualizadas por empresa e area. Veja requisitos comuns e acompanhe novas vagas para o primeiro emprego.`;
  }

  if (input.stateName) {
    return `Encontre vagas de Jovem Aprendiz no ${input.stateName} em empresas de diferentes segmentos. Veja oportunidades atualizadas, empresas contratando e requisitos comuns para iniciar no mercado de trabalho.`;
  }

    return `Encontre vagas de Jovem Aprendiz no Brasil, acompanhe empresas contratando e navegue por cidade, estado e empresa para chegar mais rápido às oportunidades com maior potencial de candidatura.`;
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

  if (
    !query &&
    !input.companySlug &&
    input.citySlug &&
    input.stateCode &&
    input.total > 0 &&
    firstPage &&
    defaultOrder
  ) {
    return buildJovemAprendizCityUfPath(input.citySlug, input.stateCode);
  }

  if (!query && input.citySlug) {
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
  if ((input.order ?? "relevance") !== "relevance") params.set("order", input.order ?? "relevance");
  if ((input.page ?? 1) > 1) params.set("page", String(input.page ?? 1));

  const queryString = params.toString();
  return queryString ? `/vagas?${queryString}` : "/vagas";
}
