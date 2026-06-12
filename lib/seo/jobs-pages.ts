import { absoluteUrl } from "@/lib/utils";

type StateSeoInput = {
  stateName: string;
  stateCode: string;
  stateSlug: string;
  totalJobs: number;
};

type CitySeoInput = {
  cityName: string;
  citySlug: string;
  stateName: string;
  stateSlug: string;
  stateCode: string;
  totalJobs: number;
};

type CompanySeoInput = {
  companyName: string;
  companySlug: string;
  totalJobs: number;
};

type JobSeoInput = {
  title: string;
  companyName: string;
  cityName: string;
  stateCode: string;
  slug: string;
};

function formatVacancyCount(totalJobs: number) {
  return `${totalJobs} ${totalJobs === 1 ? "vaga" : "vagas"}`;
}

export function getStateJobsPath(stateSlug: string) {
  return `/vagas?estado=${stateSlug}`;
}

export function getCityJobsPath(citySlug: string) {
  return `/vagas/cidade/${citySlug}`;
}

export function getCompanyJobsPath(companySlug: string) {
  return `/empresas/${companySlug}`;
}

export function getVagasEmpresaPath(companySlug: string) {
  return `/empresas/${companySlug}`;
}

export function getJobPath(slug: string) {
  return `/vagas/${slug}`;
}

export function buildStateListingSeo(input: StateSeoInput) {
  const countLabel = formatVacancyCount(input.totalJobs);
  return {
    title: `Vagas de Emprego no ${input.stateName} (${input.stateCode}) - Emprego São Luís`,
    description: `Veja ${countLabel} de emprego no ${input.stateName}. Oportunidades divulgadas em São Luís, Região Metropolitana e cidades do Maranhão.`,
    h1: `Vagas de emprego no ${input.stateName}`,
    intro:
      `Encontre vagas de emprego no ${input.stateName}. O Emprego São Luís reúne oportunidades divulgadas por empresas e fontes de recrutamento no estado.`,
    canonicalPath: getStateJobsPath(input.stateSlug)
  };
}

export function buildCityListingSeo(input: CitySeoInput) {
  const countLabel = formatVacancyCount(input.totalJobs);
  return {
    title: `Vagas em ${input.cityName}, ${input.stateCode} - Emprego São Luís`,
    description: `${countLabel} de emprego divulgadas em ${input.cityName}, ${input.stateCode}. Confira oportunidades e candidate-se pelo link oficial da empresa.`,
    h1: `Vagas de emprego em ${input.cityName}, ${input.stateCode}`,
    intro:
      `Confira vagas de emprego divulgadas em ${input.cityName}, ${input.stateCode}. O portal atua como divulgador de oportunidades — a contratação é de responsabilidade da empresa anunciante.`,
    canonicalPath: getCityJobsPath(input.citySlug)
  };
}

export function buildCompanyListingSeo(input: CompanySeoInput) {
  const countLabel = formatVacancyCount(input.totalJobs);
  return {
    title: `${input.companyName}: vagas em São Luís e Maranhão - Emprego São Luís`,
    description: `Veja ${countLabel} divulgadas pela ${input.companyName}. Requisitos, cidades e link de candidatura.`,
    h1: `Vagas na ${input.companyName}`,
    intro: `Oportunidades divulgadas pela ${input.companyName} no Emprego São Luís. Candidatos interessados devem acessar o link oficial informado em cada vaga.`,
    canonicalPath: getCompanyJobsPath(input.companySlug)
  };
}

export function buildJobDetailSeo(input: JobSeoInput) {
  return {
    title: `${input.title} em ${input.cityName} ${input.stateCode} - Emprego São Luís`,
    description: `Vaga divulgada: ${input.title} na ${input.companyName} (${input.cityName}, ${input.stateCode}). Veja descrição, requisitos e link de candidatura.`,
    canonicalPath: getJobPath(input.slug)
  };
}

export function buildListingCollectionPageJsonLd(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path)
  };
}

export function buildListingFaq(input: { name: string; totalJobs: number; type: "state" | "city" | "company" }) {
  const questions =
    input.type === "company"
      ? [
          {
            question: `Como acompanhar vagas na ${input.name}?`,
            answer: `Acompanhe esta página para ver novas oportunidades divulgadas pela ${input.name} no portal.`
          },
          {
            question: `A ${input.name} está contratando agora?`,
            answer: `Hoje o portal mostra ${formatVacancyCount(input.totalJobs)} relacionadas à ${input.name}. As vagas podem mudar conforme novas publicações entram no site.`
          }
        ]
      : [
          {
            question: `Quantas vagas existem em ${input.name}?`,
            answer: `Hoje o portal mostra ${formatVacancyCount(input.totalJobs)} ligadas a ${input.name}, com detalhes de empresa e candidatura.`
          },
          {
            question: `O Emprego São Luís contrata diretamente?`,
            answer: `Não. O portal divulga oportunidades. A contratação é de responsabilidade da empresa anunciante.`
          }
        ];

  return questions;
}
