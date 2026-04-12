type ListingDescriptorInput = {
  total: number;
  stateName?: string;
  stateCode?: string;
  cityName?: string;
  companyName?: string;
  query?: string;
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

function formatOpportunity(query?: string) {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return "Jovem Aprendiz";
  }

  const display = capitalizeWords(normalized);
  return /jovem aprendiz/i.test(normalized) ? display : `Jovem Aprendiz ${display}`;
}

function buildLocation(input: ListingDescriptorInput) {
  if (input.cityName && input.stateCode) {
    return `${input.cityName}, ${input.stateCode}`;
  }

  if (input.stateName) {
    return input.stateName;
  }

  return "";
}

export function buildJobsListingHeading(input: ListingDescriptorInput) {
  const count = formatCount(input.total);
  const location = buildLocation(input);
  const opportunity = formatOpportunity(input.query);

  if (input.companyName) {
    return `${count} de ${opportunity} na ${input.companyName}`;
  }

  if (location) {
    return `${count} de ${opportunity} em ${location}`;
  }

  return `${count} de ${opportunity} no Brasil`;
}

export function buildJobsListingMetaTitle(input: ListingDescriptorInput) {
  const opportunity = formatOpportunity(input.query);

  if (input.companyName) {
    return `${formatCount(input.total)} de ${opportunity} na ${input.companyName}`;
  }

  if (input.cityName && input.stateCode) {
    return `${formatCount(input.total)} de ${opportunity} em ${input.cityName}, ${input.stateCode}`;
  }

  if (input.stateName) {
    return `Vagas de ${opportunity} em ${input.stateName}`;
  }

  return `Vagas de ${opportunity} no Brasil`;
}

export function buildJobsListingDescription(input: ListingDescriptorInput) {
  const location = buildLocation(input);
  const opportunity = formatOpportunity(input.query);

  if (input.companyName) {
    return `Veja ${formatCount(input.total)} de ${opportunity} ligadas a ${input.companyName}, com contexto da empresa, localidade e caminhos para continuar a busca.`;
  }

  if (location) {
    return `Encontre ${formatCount(input.total)} de ${opportunity} em ${location}, com empresas ativas, detalhes da vaga e links para continuar a busca perto de voce.`;
  }

  return `Veja ${formatCount(input.total)} de ${opportunity} no Brasil, com busca por cidade, estado e empresas que costumam contratar.`;
}

export function buildJobsListingIntro(input: ListingDescriptorInput) {
  const location = buildLocation(input);
  const opportunity = formatOpportunity(input.query);

  if (input.companyName) {
    return `Esta pagina organiza as vagas de ${opportunity} ligadas a ${input.companyName} e ajuda voce a continuar a busca por cidade, estado e empresa.`;
  }

  if (location) {
    return `Aqui voce encontra vagas de ${opportunity} em ${location}, com contexto local, empresas que estao contratando e caminhos para seguir na candidatura.`;
  }

  return `Esta e a listagem principal do portal, com vagas de ${opportunity} organizadas por localidade e empresas para facilitar a busca do primeiro emprego.`;
}

type JobsSearchIndexingInput = {
  total: number;
  query?: string;
  stateSlug?: string;
  citySlug?: string;
  companySlug?: string;
  order?: "relevance" | "date";
  page?: number;
};

export function isStrategicJobsSearchIndexable(input: JobsSearchIndexingInput) {
  const query = normalizeQuery(input.query);
  const hasQuery = query.length >= 2;
  const hasLocation = Boolean(input.stateSlug || input.citySlug);
  const hasValidCityContext = !input.citySlug || Boolean(input.stateSlug);
  const hasCompany = Boolean(input.companySlug);
  const firstPage = (input.page ?? 1) === 1;
  const relevanceOrder = (input.order ?? "relevance") === "relevance";

  return input.total > 0 && firstPage && relevanceOrder && hasQuery && hasLocation && hasValidCityContext && !hasCompany;
}

export function buildJobsSearchCanonicalPath(input: JobsSearchIndexingInput) {
  const params = new URLSearchParams();
  const query = normalizeQuery(input.query);
  const isIndexable = isStrategicJobsSearchIndexable(input);

  if (!query && input.stateSlug && input.citySlug) {
    return `/vagas/estado/${input.stateSlug}/${input.citySlug}`;
  }

  if (!query && input.stateSlug) {
    return `/vagas/estado/${input.stateSlug}`;
  }

  if (!query && input.companySlug) {
    return `/empresas/${input.companySlug}`;
  }

  if (query) params.set("q", query);
  if (input.stateSlug) params.set("estado", input.stateSlug);
  if (input.citySlug) params.set("cidade", input.citySlug);
  if (input.companySlug) params.set("empresa", input.companySlug);
  if ((input.order ?? "relevance") !== "relevance") params.set("order", input.order ?? "relevance");
  if ((input.page ?? 1) > 1) params.set("page", String(input.page ?? 1));

  const queryString = params.toString();
  if (!queryString) {
    return "/vagas";
  }

  if (isIndexable) {
    return `/vagas?${queryString}`;
  }

  return `/vagas?${queryString}`;
}
