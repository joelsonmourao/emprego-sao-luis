import { absoluteUrl } from "@/lib/utils";

type HubSeoInput = {
  pathname: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  canonicalUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type StateInput = {
  stateName: string;
  stateCode?: string;
  totalJobs: number;
  cityCount?: number;
  pathname: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
};

type CityInput = {
  cityName: string;
  stateName: string;
  stateCode: string;
  totalJobs: number;
  pathname: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
};

type CompanyInput = {
  companyName: string;
  cityName: string;
  stateCode: string;
  totalJobs: number;
  pathname: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
};

type CollectionInput = {
  total: number;
  pathname: string;
};

function applyOverrides(input: HubSeoInput): HubSeoInput {
  return {
    ...input,
    title: input.seoTitle?.trim() || input.title,
    description: input.seoDescription?.trim() || input.description,
    canonicalUrl: input.canonicalUrl ? absoluteUrl(input.canonicalUrl) : undefined
  };
}

function formatCount(total: number, singular: string, plural: string) {
  return `${total} ${total === 1 ? singular : plural}`;
}

export function buildStatesIndexSeo(input: CollectionInput) {
  return {
    title: `Estados com vagas de Jovem Aprendiz | ${formatCount(input.total, "estado monitorado", "estados monitorados")}`,
    description: `Veja ${formatCount(input.total, "estado com vagas", "estados com vagas")} de Jovem Aprendiz e escolha onde vale acompanhar oportunidades e cidades com mais movimento.`,
    h1: "Estados com vagas de Jovem Aprendiz",
    intro: "Escolha um estado para ver as cidades mais relevantes, acompanhar oportunidades locais e seguir para as paginas com vagas abertas."
  };
}

export function buildCitiesIndexSeo(input: CollectionInput) {
  return {
    title: `Cidades com vagas de Jovem Aprendiz | ${formatCount(input.total, "cidade mapeada", "cidades mapeadas")}`,
    description: `Explore ${formatCount(input.total, "cidade com vagas", "cidades com vagas")} de Jovem Aprendiz e entre direto nas paginas locais com oportunidades mais perto de voce.`,
    h1: "Cidades com vagas de Jovem Aprendiz",
    intro: "Entre pela sua cidade para encontrar vagas mais proximas, entender quais empresas contratam e seguir a busca com mais foco."
  };
}

export function buildCompaniesIndexSeo(input: CollectionInput) {
  return {
    title: `Empresas com vagas de Jovem Aprendiz | ${formatCount(input.total, "empresa listada", "empresas listadas")}`,
    description: `Veja ${formatCount(input.total, "empresa com vagas", "empresas com vagas")} de Jovem Aprendiz e acompanhe quais companhias estao publicando oportunidades no portal.`,
    h1: "Empresas que contratam Jovem Aprendiz",
    intro: "Use esta lista para descobrir empresas ativas no portal, comparar localidade e entrar nas paginas com vagas ligadas a cada marca."
  };
}

export function buildStateDirectorySeo(input: StateInput) {
  return applyOverrides({
    pathname: input.pathname,
    title: `Cidades com vagas de Jovem Aprendiz em ${input.stateName}`,
    description: `Veja cidades e oportunidades de Jovem Aprendiz em ${input.stateName}, com ${formatCount(input.totalJobs, "vaga ativa", "vagas ativas")} e caminhos para continuar a busca no estado.`,
    h1: `Cidades com vagas de Jovem Aprendiz em ${input.stateName}`,
    intro: `Esta pagina organiza as cidades com vagas de Jovem Aprendiz em ${input.stateName}. Hoje o portal acompanha ${formatCount(input.cityCount ?? 0, "cidade com vagas", "cidades com vagas")} e ${formatCount(input.totalJobs, "oportunidade ativa", "oportunidades ativas")} no estado.`,
    canonicalUrl: input.canonicalUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription
  });
}

export function buildStateJobsSeo(input: StateInput) {
  return applyOverrides({
    pathname: input.pathname,
    title: `Vagas de Jovem Aprendiz em ${input.stateName}`,
    description: `Encontre ${formatCount(input.totalJobs, "vaga de Jovem Aprendiz", "vagas de Jovem Aprendiz")} em ${input.stateName}, com cidades e empresas que ajudam a continuar a busca no estado.`,
    h1: `${formatCount(input.totalJobs, "vaga de Jovem Aprendiz", "vagas de Jovem Aprendiz")} em ${input.stateName}`,
    intro: `Aqui voce acompanha as vagas de Jovem Aprendiz em ${input.stateName}, compara cidades do estado e encontra empresas que costumam abrir oportunidades para primeiro emprego.`,
    canonicalUrl: input.canonicalUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription
  });
}

export function buildCityJobsSeo(input: CityInput) {
  return applyOverrides({
    pathname: input.pathname,
    title: `Vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}`,
    description: `Veja ${formatCount(input.totalJobs, "vaga de Jovem Aprendiz", "vagas de Jovem Aprendiz")} em ${input.cityName}, ${input.stateCode}, com empresas locais, links relacionados e apoio para continuar a busca.`,
    h1: `${formatCount(input.totalJobs, "vaga de Jovem Aprendiz", "vagas de Jovem Aprendiz")} em ${input.cityName}, ${input.stateCode}`,
    intro: `Esta pagina reune vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}, para facilitar a busca local de quem quer entrar no mercado de trabalho em ${input.stateName}.`,
    canonicalUrl: input.canonicalUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription
  });
}

export function buildCompanyJobsSeo(input: CompanyInput) {
  return applyOverrides({
    pathname: input.pathname,
    title: `Vagas de Jovem Aprendiz na ${input.companyName}`,
    description: `Acompanhe ${formatCount(input.totalJobs, "vaga de Jovem Aprendiz", "vagas de Jovem Aprendiz")} ligadas a ${input.companyName}, com contexto da empresa, cidade e caminhos para continuar a busca.`,
    h1: `${formatCount(input.totalJobs, "vaga de Jovem Aprendiz", "vagas de Jovem Aprendiz")} na ${input.companyName}`,
    intro: `Aqui voce encontra vagas de Jovem Aprendiz ligadas a ${input.companyName}, com base na presenca da empresa em ${input.cityName}, ${input.stateCode}, e links para seguir na busca com mais contexto.`,
    canonicalUrl: input.canonicalUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription
  });
}

export function buildCollectionPageJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path)
  };
}
