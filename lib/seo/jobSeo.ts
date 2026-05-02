/**
 * Textos SEO centralizados para listagens por cidade/UF (dados reais, tom de agregador).
 */

export type JobCitySeoBase = {
  count: number;
  /** Ex.: "Jovem Aprendiz" — não inventar outro termo sem dados. */
  keyword: string;
  city: string;
  uf: string;
};


function vacancyCountPhrase(count: number, keyword: string) {
  if (count === 1) return `1 vaga de ${keyword}`;
  return `${count} vaga(s) de ${keyword}`;
}

function vacancyCountWordVagas(count: number) {
  return count === 1 ? "1 vaga" : `${count} vagas`;
}

/** Limita meta description (~160) cortando em espaço quando possível. */
export function clampMetaDescription(text: string, max = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 120 ? slice.slice(0, lastSpace) : slice;
  return cut.trimEnd() + (cut.endsWith(".") ? "" : ".");
}

/** Título sem sufixo de marca — o layout raiz aplica `template: "%s | {siteName}"`. */
export function generateJobCitySeoTitle(input: JobCitySeoBase) {
  return `${vacancyCountPhrase(input.count, input.keyword)} em ${input.city}, ${input.uf}`;
}

export function generateJobCitySeoDescription(input: JobCitySeoBase & { companies?: string[] }) {
  const loc = `${input.city}, ${input.uf}`;
  const companies = (input.companies ?? []).map((c) => c.trim()).filter(Boolean);
  const unique = [...new Set(companies)].slice(0, 3);

  let text: string;
  if (unique.length >= 2) {
    const listed =
      unique.length === 2
        ? `${unique[0]} e ${unique[1]}`
        : `${unique.slice(0, -1).join(", ")} e ${unique[unique.length - 1]}`;
    text = `Confira ${vacancyCountWordVagas(input.count)} de ${input.keyword} em ${loc}, com oportunidades em empresas como ${listed}. Veja detalhes das vagas e como se candidatar.`;
  } else {
    text = `Confira ${vacancyCountWordVagas(input.count)} de ${input.keyword} em ${loc}. Veja oportunidades disponíveis, empresas contratando e detalhes para se candidatar.`;
  }

  return clampMetaDescription(text);
}

export function generateJobCityH1(input: JobCitySeoBase) {
  return `${vacancyCountPhrase(input.count, input.keyword)} em ${input.city}, ${input.uf}`;
}

export function generateJobCityIntro(input: JobCitySeoBase & { companies?: string[] }) {
  const loc = `${input.city}, ${input.uf}`;
  const companies = (input.companies ?? []).map((c) => c.trim()).filter(Boolean);
  const unique = [...new Set(companies)].slice(0, 3);

  if (unique.length >= 2) {
    const listed =
      unique.length === 2
        ? `${unique[0]} e ${unique[1]}`
        : `${unique.slice(0, -1).join(", ")} e ${unique[unique.length - 1]}`;
    return `Procure vagas de ${input.keyword} em ${loc}. Encontre oportunidades em empresas como ${listed}, além de outras vagas disponíveis na região. As oportunidades são divulgadas por empresas terceiras; este site apenas reúne informações públicas.`;
  }

  return `Procure vagas de ${input.keyword} em ${loc}. Veja oportunidades disponíveis, empresas contratando e informações das vagas abertas para jovens aprendizes. As oportunidades são divulgadas por empresas terceiras; este site apenas reúne informações públicas.`;
}

export function generateJobCityAboutTitle(city: string, uf: string) {
  return `Sobre as vagas de Jovem Aprendiz em ${city}, ${uf}`;
}

export function generateJobCityAboutBody(city: string, uf: string) {
  return `As vagas de Jovem Aprendiz em ${city}, ${uf} podem incluir oportunidades em áreas administrativas, atendimento, loja, logística, estoque e apoio operacional, conforme a descrição de cada empresa. Verifique os requisitos, a jornada e as orientações de candidatura em cada vaga antes de se candidatar.`;
}

export function generateJobCityFaq(city: string, uf: string) {
  const loc = `${city}, ${uf}`;
  return [
    {
      question: `Como encontrar vagas de Jovem Aprendiz em ${loc}?`,
      answer:
        "Você pode acompanhar as vagas disponíveis nesta página e verificar os detalhes de cada oportunidade, como empresa, localização, requisitos e forma de candidatura."
    },
    {
      question: `Quais empresas contratam Jovem Aprendiz em ${loc}?`,
      answer:
        "As empresas exibidas podem variar conforme as vagas disponíveis no momento. Consulte os cards de vagas para ver quais empresas estão com oportunidades abertas."
    },
    {
      question: "Como se candidatar às vagas de Jovem Aprendiz?",
      answer:
        "Abra a vaga desejada, leia as informações com atenção e siga as orientações de candidatura informadas pela empresa responsável pela oportunidade."
    }
  ];
}
