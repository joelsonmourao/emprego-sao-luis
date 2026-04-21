import { absoluteUrl } from "@/lib/utils";

type StateSeoInput = {
  stateName: string;
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
  return `/vagas/estado/${stateSlug}`;
}

export function getCityJobsPath(citySlug: string) {
  return `/vagas/cidade/${citySlug}`;
}

export function getCompanyJobsPath(companySlug: string) {
  return `/empresa/${companySlug}/jovem-aprendiz`;
}

export function getJobPath(slug: string) {
  return `/vagas/${slug}`;
}

export function buildStateListingSeo(input: StateSeoInput) {
  return {
    title: `${formatVacancyCount(input.totalJobs)} de Jovem Aprendiz no ${input.stateName}`,
    description: `Procure vagas de Jovem Aprendiz no ${input.stateName}. Veja empresas contratando, requisitos e ${formatVacancyCount(
      input.totalJobs
    )} abertas para candidatura.`,
    h1: `Vagas de Jovem Aprendiz no ${input.stateName}`,
    intro:
      `Encontre vagas de Jovem Aprendiz no ${input.stateName} em empresas de diferentes segmentos. ` +
      `Veja oportunidades atualizadas, empresas contratando e requisitos comuns para iniciar no mercado de trabalho.`,
    canonicalPath: getStateJobsPath(input.stateSlug)
  };
}

export function buildCityListingSeo(input: CitySeoInput) {
  return {
    title: `${formatVacancyCount(input.totalJobs)} de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}`,
    description: `Procure vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}. Veja empresas, requisitos e ${formatVacancyCount(
      input.totalJobs
    )} abertas para candidatura.`,
    h1: `Vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}`,
    intro:
      `Confira vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}, com oportunidades atualizadas por empresa e area. ` +
      `Veja requisitos comuns e acompanhe novas vagas para o primeiro emprego.`,
    canonicalPath: getCityJobsPath(input.citySlug)
  };
}

export function buildCompanyListingSeo(input: CompanySeoInput) {
  const countDrivenTitle =
    input.totalJobs >= 3 ? `${formatVacancyCount(input.totalJobs)} de Jovem Aprendiz no ${input.companyName}` : null;

  return {
    title: countDrivenTitle ?? `Jovem Aprendiz no ${input.companyName} - vagas, requisitos e como se candidatar`,
    description: `Veja vagas de Jovem Aprendiz no ${input.companyName}, requisitos mais comuns, perfil buscado e como se candidatar as oportunidades.`,
    h1: `Jovem Aprendiz no ${input.companyName}`,
    intro:
      `Confira oportunidades de Jovem Aprendiz no ${input.companyName}, veja requisitos frequentes, cidades com vagas e orientacoes para acompanhar novas oportunidades.`,
    canonicalPath: getCompanyJobsPath(input.companySlug)
  };
}

export function buildJobDetailSeo(input: JobSeoInput) {
  return {
    title: `${input.title} em ${input.companyName} - ${input.cityName}, ${input.stateCode}`,
    description: `Veja detalhes da vaga de ${input.title} em ${input.companyName}, localizada em ${input.cityName}, ${input.stateCode}. Confira requisitos, beneficios e como se candidatar.`,
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
            question: `Como acompanhar novas vagas de Jovem Aprendiz no ${input.name}?`,
            answer: `Acompanhe a pagina do ${input.name} para ver novas oportunidades, cidades com vagas e atualizacoes recentes do portal.`
          },
          {
            question: `O ${input.name} esta contratando Jovem Aprendiz agora?`,
            answer: `Hoje o portal mostra ${formatVacancyCount(input.totalJobs)} relacionadas ao ${input.name}. As vagas ativas podem mudar conforme novas publicacoes entram no portal.`
          }
        ]
      : [
          {
            question: `Quantas vagas de Jovem Aprendiz existem em ${input.name}?`,
            answer: `Hoje o portal mostra ${formatVacancyCount(input.totalJobs)} ligadas a ${input.name}, com detalhes de empresa, requisitos e candidatura.`
          },
          {
            question: `Como encontrar empresas com vagas de Jovem Aprendiz em ${input.name}?`,
            answer: `Use os blocos de empresas da pagina para acessar marcas com vagas abertas e continuar a busca pelas oportunidades mais recentes.`
          }
        ];

  return questions;
}
