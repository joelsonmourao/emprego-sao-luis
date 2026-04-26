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
  return `/vagas/estado/${stateSlug}`;
}

export function getCityJobsPath(citySlug: string) {
  return `/vagas/cidade/${citySlug}`;
}

export function getCompanyJobsPath(companySlug: string) {
  return `/empresa/${companySlug}/jovem-aprendiz`;
}

/** Hub de empresa sob /vagas (SEO complementar, sem alterar URLs canonicas existentes de vaga). */
export function getVagasEmpresaPath(companySlug: string) {
  return `/vagas/empresa/${companySlug}`;
}

export function getJobPath(slug: string) {
  return `/vagas/${slug}`;
}

export function buildStateListingSeo(input: StateSeoInput) {
  const countLabel = formatVacancyCount(input.totalJobs);
  return {
    title: `${countLabel} de Jovem Aprendiz no ${input.stateCode}`,
    description: `Veja ${countLabel} de Jovem Aprendiz no ${input.stateName} (${input.stateCode}), compare empresas contratando e encontre oportunidades com candidatura oficial.`,
    h1: `Vagas de Jovem Aprendiz no ${input.stateCode}`,
    intro:
      `Encontre vagas de Jovem Aprendiz no ${input.stateName} em empresas de diferentes segmentos. ` +
      `Veja oportunidades atualizadas, empresas contratando e requisitos comuns para iniciar no mercado de trabalho.`,
    canonicalPath: getStateJobsPath(input.stateSlug)
  };
}

export function buildCityListingSeo(input: CitySeoInput) {
  const countLabel = formatVacancyCount(input.totalJobs);
  return {
    title: `${countLabel} em ${input.cityName}, ${input.stateCode} | Jovem Aprendiz`,
    description: `${input.cityName} (${input.stateCode}): ${countLabel} de Jovem Aprendiz com empresas, requisitos e candidatura. Pagina focada em primeiro emprego na regiao.`,
    h1: `Vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}`,
    intro:
      `Confira vagas de Jovem Aprendiz em ${input.cityName}, ${input.stateCode}, com oportunidades atualizadas por empresa e area. ` +
      `Veja requisitos comuns e acompanhe novas vagas para o primeiro emprego.`,
    canonicalPath: getCityJobsPath(input.citySlug)
  };
}

export function buildCompanyListingSeo(
  input: CompanySeoInput,
  options?: { variant?: "default" | "vagas-hub" }
) {
  const countDrivenTitle =
    input.totalJobs >= 3 ? `${formatVacancyCount(input.totalJobs)} no ${input.companyName} | Jovem Aprendiz` : null;

  const canonicalPath =
    options?.variant === "vagas-hub" ? getVagasEmpresaPath(input.companySlug) : getCompanyJobsPath(input.companySlug);

  return {
    title: countDrivenTitle ?? `${input.companyName}: vagas de Jovem Aprendiz e candidatura`,
    description: `Oportunidades de Jovem Aprendiz no ${input.companyName}: requisitos, perfil buscado, cidades e como se candidatar. ${formatVacancyCount(input.totalJobs)} listadas nesta pagina.`,
    h1: `Jovem Aprendiz no ${input.companyName}`,
    intro:
      `Confira oportunidades de Jovem Aprendiz no ${input.companyName}, veja requisitos frequentes, cidades com vagas e orientacoes para acompanhar novas oportunidades.`,
    canonicalPath
  };
}

export function buildJobDetailSeo(input: JobSeoInput) {
  return {
    title: `${input.title} | ${input.companyName} — ${input.cityName}, ${input.stateCode}`,
    description: `Vaga de Jovem Aprendiz: ${input.title} na ${input.companyName} (${input.cityName}, ${input.stateCode}). Resumo, requisitos, beneficios e link oficial para candidatura.`,
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
