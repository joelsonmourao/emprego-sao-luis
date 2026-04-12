type ListingDescriptorInput = {
  total: number;
  stateName?: string;
  stateCode?: string;
  cityName?: string;
  companyName?: string;
};

function formatCount(total: number) {
  return `${total} ${total === 1 ? "vaga" : "vagas"}`;
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

  if (input.companyName) {
    return `${count} de Jovem Aprendiz na ${input.companyName}`;
  }

  if (location) {
    return `${count} de Jovem Aprendiz em ${location}`;
  }

  return `${count} de Jovem Aprendiz no Brasil`;
}

export function buildJobsListingMetaTitle(input: ListingDescriptorInput) {
  if (input.companyName) {
    return `${formatCount(input.total)} de Jovem Aprendiz na ${input.companyName}`;
  }

  if (input.cityName && input.stateCode) {
    return `${formatCount(input.total)} de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}`;
  }

  if (input.stateName) {
    return `Jovem Aprendiz em ${input.stateName}: vagas atualizadas`;
  }

  return "Vagas de Jovem Aprendiz no Brasil";
}

export function buildJobsListingDescription(input: ListingDescriptorInput) {
  const location = buildLocation(input);

  if (input.companyName) {
    return `Veja ${formatCount(input.total)} de Jovem Aprendiz ligadas a ${input.companyName}, com contexto de empresa, cidade e links para continuar a busca.`;
  }

  if (location) {
    return `Explore ${formatCount(input.total)} de Jovem Aprendiz em ${location}, com filtros por cidade, estado e caminhos relacionados para aprofundar a busca.`;
  }

  return `Veja ${formatCount(input.total)} de Jovem Aprendiz no Brasil, com busca por cidade, estado e empresas que costumam contratar.`;
}

export function buildJobsListingIntro(input: ListingDescriptorInput) {
  const location = buildLocation(input);

  if (input.companyName) {
    return `Esta pagina organiza as vagas de Jovem Aprendiz relacionadas a ${input.companyName} e ajuda voce a continuar a busca por cidade, estado e empresa.`;
  }

  if (location) {
    return `Esta pagina reune vagas de Jovem Aprendiz em ${location}, deixando a busca mais clara e abrindo caminhos para cidades proximas, empresas e conteudos que podem ajudar na candidatura.`;
  }

  return `Esta e a listagem principal do portal, com vagas de Jovem Aprendiz organizadas por localidade e empresas para facilitar a busca do primeiro emprego.`;
}
