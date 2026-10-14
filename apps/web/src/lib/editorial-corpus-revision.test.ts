import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  guidesPendingReview,
  newsFactChecked,
  newsPendingFactCheck,
  isEditorialReviewPending
} from "../data/editorial-review-pending";
import { getEditorialContentOverride } from "../data/editorial-content-overrides";
import { getNewsEditorialOverride } from "../data/news-editorial-content-overrides";

const load = (p: string) => readFileSync(resolve(p), "utf8");
const report = (n: 1 | 2) =>
  JSON.parse(load(`reports/adsense-revisao-integral-parte-${n}.json`)) as {
    findings: { slug: string; words: number; flags: string[]; images: string[] }[];
  };
const all = [...report(1).findings, ...report(2).findings];

describe("Auditoria editorial real do corpus de 12/10/2026", () => {
  it("contém evidência individual de todos os 106 guias, sem duplicata", () => {
    expect(all).toHaveLength(106);
    expect(new Set(all.map((x) => x.slug)).size).toBe(106);
    expect(new Set(all.map((x) => x.images[0])).size).toBe(106);
  });

  it("registra exatamente os 98 guias com conteúdo repetitivo ou curto", () => {
    const flagged = all.filter((x) => x.flags.includes("TEMPLATE_REPEATED") || x.flags.includes("SHORT"));
    expect(flagged).toHaveLength(98);
    const reviewed = flagged.filter((item) => getEditorialContentOverride(item.slug));
    const pending = flagged.filter((item) => !getEditorialContentOverride(item.slug));
    expect(reviewed).toHaveLength(98);
    expect(pending).toHaveLength(0);
    expect(guidesPendingReview.size).toBe(pending.length);
    for (const item of pending) expect(guidesPendingReview.has(item.slug)).toBe(true);
    for (const item of reviewed) expect(guidesPendingReview.has(item.slug)).toBe(false);
  });

  it("não usa um único noindex genérico: cada slug possui evidência registrada", () => {
    for (const item of all) {
      const flagged = item.flags.includes("TEMPLATE_REPEATED") || item.flags.includes("SHORT");
      const expected = flagged && !getEditorialContentOverride(item.slug);
      expect(isEditorialReviewPending("GUIDE", item.slug)).toBe(expected);
    }
    expect(newsFactChecked.size).toBe(5);
    expect(newsPendingFactCheck.size).toBe(0);
  });

  it("revisões de guias possuem conteúdo específico e não repetem o template antigo", () => {
    const edited = [
      "mensagem-fria-recrutador-linkedin",
      "acompanhar-candidatura-emprego",
      "pesquisar-empresa-antes-entrevista",
      "seguro-desemprego-checklist-documentos",
      "ctps-digital-carteira-trabalho-consultar",
      "fgts-consultar-trabalhador-clt",
      "ler-contrato-trabalho-clt",
      "curriculo-pdf-erros-triagem",
      "entrevista-comportamental-exemplos",
      "primeiro-emprego-sao-luis-checklist",
      "acidente-de-trabalho-o-que-fazer",
      "assedio-no-trabalho-o-que-fazer",
      "atestado-medico-trabalho-como-entregar",
      "banco-de-horas-direitos-trabalhador",
      "convencao-coletiva-holerite-trabalhador",
      "escala-6x1-o-que-perguntar",
      "hora-extra-holerite-como-conferir",
      "pedido-demissao-aviso-previo-acerto",
      "abono-pecuniario-ferias-holerite",
      "ferias-clt-periodo-aquisitivo",
      "periodo-experiencia-clt-o-que-saber",
      "ponto-eletronico-atraso-trabalho",
      "trabalhador-terceirizado-direitos",
      "trabalhar-fim-de-semana-folga-adicional",
      "trabalho-noturno-adicional-o-que-perguntar",
      "retorno-trabalho-apos-maternidade",
      "como-ler-holerite-descontos",
      "freelancer-ou-clt-vantagens",
      "mitos-direitos-trabalhistas-whatsapp",
      "servicos-gerais-epi-vaga",
      "sindicato-trabalhador-direitos-basico",
      "transferencia-interna-emprego-como-pedir",
      "vale-alimentacao-ou-refeicao-diferenca",
      "documentos-admissao-emprego-maranhao",
      "auxiliar-administrativo-vagas-sao-luis",
      "vaga-recepcionista-clinica-sao-luis",
      "vagas-call-center-sao-luis",
      "vagas-estoque-logistica-sao-luis",
      "vagas-motorista-entregador-sao-luis",
      "vagas-restaurante-sao-luis-dicas",
      "vaga-sazonal-comercio-sao-luis",
      "vagas-pcd-inclusao-emprego",
      "golpe-vaga-emprego-sao-luis",
      "seguranca-candidatas-entrevista-emprego",
      "home-office-remoto-checklist-vaga",
      "trabalho-hibrido-sao-luis-checklist",
      "pretensao-salarial-entrevista-dicas",
      "como-pedir-aumento-salario",
      "negociar-horario-deslocamento-emprego",
      "vagas-afirmativas-como-candidatar",
      "candidatura-whatsapp-emprego-mensagem",
      "email-candidatura-emprego-modelo",
      "entrevista-por-video-emprego",
      "entrevista-presencial-sao-luis-dicas",
      "referencias-profissionais-emprego",
      "experiencia-informal-curriculo-como-colocar",
      "curriculo-ats-palavras-chave-sao-luis",
      "ingles-no-curriculo-nivel-honesto",
      "alfabetizacao-digital-emprego-basico",
      "certificado-ou-experiencia-curriculo",
      "cursos-no-curriculo-sem-enchimento",
      "excel-basico-vagas-emprego",
      "gap-habilidades-candidatura-como-fechar",
      "soft-skills-hard-skills-curriculo",
      "portfolio-simples-candidato-emprego",
      "teste-online-processo-seletivo-dicas",
      "como-usar-empregos-sao-luis",
      "vagas-vendedor-loja-comissao-dicas",
      "saude-mental-trabalho-limites",
      "esgotamento-busca-emprego-sinais",
      "conflito-com-chefe-trabalho-dicas",
      "avaliacao-de-desempenho-preparacao",
      "primeira-semana-emprego-novo",
      "plano-90-dias-emprego-sao-luis",
      "agradecimento-pos-entrevista-mensagem",
      "carta-apresentacao-emprego-curta",
      "comparar-beneficios-vaga-emprego",
      "comparar-duas-propostas-emprego",
      "dinamica-de-grupo-entrevista-dicas",
      "empatia-atendimento-cliente-entrevista",
      "emprego-apos-40-anos-curriculo",
      "entrevista-desligamento-o-que-falar",
      "follow-up-apos-entrevista-mensagem",
      "gestao-de-tempo-trabalho-dicas",
      "inteligencia-emocional-entrevista",
      "linkedin-emprego-sao-luis-perfil",
      "marca-pessoal-candidatura-sao-luis",
      "mudanca-de-carreira-sao-luis-curriculo",
      "networking-emprego-sao-luis",
      "o-que-vestir-entrevista-emprego",
      "pedir-feedback-entrevista-emprego",
      "plano-semanal-vagas-sao-luis",
      "produtividade-busca-emprego-sao-luis",
      "rejeicao-processo-seletivo-como-reagir",
      "retorno-mercado-trabalho-gap-curriculo",
      "transporte-entrevista-emprego-sao-luis"
    ];
    for (const slug of edited) {
      const override = getEditorialContentOverride(slug);
      expect(override).not.toBeNull();
      expect(override!.contentHtml.length).toBeGreaterThan(1200);
      expect(override!.contentHtml).not.toContain("Uma situação comum na prática");
      expect(override!.contentHtml).not.toContain("No tema em pauta");
      expect(override!.contentHtml).toContain("<h2>");
    }

    const sourceBacked = [
      "acidente-de-trabalho-o-que-fazer",
      "assedio-no-trabalho-o-que-fazer",
      "atestado-medico-trabalho-como-entregar",
      "banco-de-horas-direitos-trabalhador",
      "convencao-coletiva-holerite-trabalhador",
      "escala-6x1-o-que-perguntar",
      "hora-extra-holerite-como-conferir",
      "pedido-demissao-aviso-previo-acerto",
      "abono-pecuniario-ferias-holerite",
      "ferias-clt-periodo-aquisitivo",
      "periodo-experiencia-clt-o-que-saber",
      "ponto-eletronico-atraso-trabalho",
      "trabalhador-terceirizado-direitos",
      "trabalhar-fim-de-semana-folga-adicional",
      "trabalho-noturno-adicional-o-que-perguntar",
      "retorno-trabalho-apos-maternidade",
      "como-ler-holerite-descontos",
      "freelancer-ou-clt-vantagens",
      "mitos-direitos-trabalhistas-whatsapp",
      "servicos-gerais-epi-vaga",
      "sindicato-trabalhador-direitos-basico",
      "transferencia-interna-emprego-como-pedir",
      "vale-alimentacao-ou-refeicao-diferenca",
      "documentos-admissao-emprego-maranhao",
      "auxiliar-administrativo-vagas-sao-luis",
      "vaga-recepcionista-clinica-sao-luis",
      "vagas-call-center-sao-luis",
      "vagas-estoque-logistica-sao-luis",
      "vagas-motorista-entregador-sao-luis",
      "vagas-restaurante-sao-luis-dicas",
      "vaga-sazonal-comercio-sao-luis",
      "vagas-pcd-inclusao-emprego",
      "golpe-vaga-emprego-sao-luis",
      "seguranca-candidatas-entrevista-emprego",
      "home-office-remoto-checklist-vaga",
      "trabalho-hibrido-sao-luis-checklist",
      "pretensao-salarial-entrevista-dicas",
      "como-pedir-aumento-salario",
      "negociar-horario-deslocamento-emprego",
      "vagas-afirmativas-como-candidatar",
      "candidatura-whatsapp-emprego-mensagem",
      "email-candidatura-emprego-modelo",
      "entrevista-por-video-emprego",
      "entrevista-presencial-sao-luis-dicas",
      "referencias-profissionais-emprego",
      "experiencia-informal-curriculo-como-colocar",
      "curriculo-ats-palavras-chave-sao-luis",
      "ingles-no-curriculo-nivel-honesto",
      "alfabetizacao-digital-emprego-basico",
      "certificado-ou-experiencia-curriculo",
      "cursos-no-curriculo-sem-enchimento",
      "excel-basico-vagas-emprego",
      "gap-habilidades-candidatura-como-fechar",
      "soft-skills-hard-skills-curriculo",
      "portfolio-simples-candidato-emprego",
      "teste-online-processo-seletivo-dicas",
      "como-usar-empregos-sao-luis",
      "vagas-vendedor-loja-comissao-dicas",
      "saude-mental-trabalho-limites",
      "esgotamento-busca-emprego-sinais",
      "conflito-com-chefe-trabalho-dicas",
      "avaliacao-de-desempenho-preparacao",
      "primeira-semana-emprego-novo",
      "plano-90-dias-emprego-sao-luis",
      "agradecimento-pos-entrevista-mensagem",
      "carta-apresentacao-emprego-curta",
      "comparar-beneficios-vaga-emprego",
      "comparar-duas-propostas-emprego",
      "dinamica-de-grupo-entrevista-dicas",
      "empatia-atendimento-cliente-entrevista",
      "emprego-apos-40-anos-curriculo",
      "entrevista-desligamento-o-que-falar",
      "follow-up-apos-entrevista-mensagem",
      "gestao-de-tempo-trabalho-dicas",
      "inteligencia-emocional-entrevista",
      "linkedin-emprego-sao-luis-perfil",
      "marca-pessoal-candidatura-sao-luis",
      "mudanca-de-carreira-sao-luis-curriculo",
      "networking-emprego-sao-luis",
      "o-que-vestir-entrevista-emprego",
      "pedir-feedback-entrevista-emprego",
      "plano-semanal-vagas-sao-luis",
      "produtividade-busca-emprego-sao-luis",
      "rejeicao-processo-seletivo-como-reagir",
      "retorno-mercado-trabalho-gap-curriculo",
      "transporte-entrevista-emprego-sao-luis"
    ];
    for (const slug of sourceBacked) {
      expect(getEditorialContentOverride(slug)!.contentHtml).toMatch(/<a href="https:\/\//);
    }
  });

  it("cinco notícias antigas possuem revisões factuais substanciais e referências identificáveis", () => {
    for (const slug of newsFactChecked) {
      const revised = getNewsEditorialOverride(slug);
      expect(revised).not.toBeNull();
      const words = revised!.contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ");
      const sources = [...revised!.contentHtml.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);
      expect(revised!.reviewedAt).toBe("2026-10-13");
      expect(words.length).toBeGreaterThanOrEqual(500);
      expect(new Set(sources).size).toBeGreaterThanOrEqual(2);
      expect(revised!.contentHtml).toMatch(/<a href="https:\/\/(?:www\.)?(?:gov\.br|planalto\.gov\.br|diariooficial\.saoluis\.ma\.gov\.br)/);
      expect(revised!.contentHtml).not.toContain("No tema em pauta");
      expect(revised!.contentHtml).not.toMatch(/vagas abertas hoje|contratação garantida|salário médio/i);
    }
  });

  it("preserva a publicação original e usa a revisão apenas como dateModified", () => {
    const news = load("apps/web/src/pages/noticias/[slug].astro");
    const schema = load("apps/web/src/lib/editorial-schema.ts");
    expect(news).toContain("publishedAt: article.publishedAt");
    expect(news).toContain("article.publishedAt?.toLocaleDateString(\"pt-BR\")");
    expect(news).toContain("editorialOverride.reviewedAt");
    expect(news).toContain("Revisado em");
    expect(news).toContain("updatedAt: reviewedAt ?? article.updatedAt");
    expect(schema).toContain("datePublished: input.publishedAt.toISOString()");
    expect(schema).toContain("dateModified: modifiedAt.toISOString()");
  });

  it("não monetiza artigos pendentes marcados noindex", () => {
    const layout = load("apps/web/src/layouts/BaseLayout.astro");
    expect(layout).toContain("!noindex && !/");
    expect(layout).toContain("adsWanted");
  });

  it("noindex individual e sitemap utilizam a mesma classificação e exceção revisada", () => {
    const blog = load("apps/web/src/pages/blog/[slug].astro");
    const news = load("apps/web/src/pages/noticias/[slug].astro");
    const sitemap = load("apps/web/src/lib/sitemaps.ts");
    expect(blog).toContain("noindex={editorialNoindex}");
    expect(news).toContain("noindex={editorialNoindex}");
    expect(blog).toContain("getEditorialContentOverride");
    expect(news).toContain("getNewsEditorialOverride");
    expect(sitemap).toContain("isEditorialReviewPending(row.type, row.slug)");
    expect(sitemap).toContain("getNewsEditorialOverride");
  });
});
