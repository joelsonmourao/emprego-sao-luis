import { describe, expect, it } from "vitest";
import { assessEditorialArticle, classifySourceUrl, type EditorialArticleInput } from "./editorial-audit";

function article(partial: Partial<EditorialArticleInput> = {}): EditorialArticleInput {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Como montar currículo em São Luís",
    slug: "curriculo-sao-luis",
    type: "GUIDE",
    excerpt: "Guia prático",
    contentHtml: "<p>" + "texto útil local ".repeat(40) + "</p>",
    status: "PUBLISHED",
    editorialStage: "EDITORIAL_REVIEW",
    authorId: "22222222-2222-2222-2222-222222222222",
    reviewerId: "33333333-3333-3333-3333-333333333333",
    reviewedAt: new Date(),
    factCheckedAt: new Date(),
    pillarId: "44444444-4444-4444-4444-444444444444",
    clusterId: "55555555-5555-5555-5555-555555555555",
    primaryKeyword: "curriculo sao luis",
    sourceName: "Governo",
    sourceUrl: "https://www.gov.br/trabalho",
    sources: [],
    seoTitle: "Currículo em São Luís",
    metaDescription: "Orientação prática",
    canonicalUrl: "/blog/curriculo-sao-luis",
    coverImageUrl: "https://cdn.example.com/a.jpg",
    coverImageAlt: "Pessoa com currículo",
    coverImageCaption: "Ilustração",
    coverImageCredit: "Arquivo",
    localHook: "São Luís",
    updatedAt: new Date(),
    publishedAt: new Date(),
    ...partial
  };
}

describe("editorial audit", () => {
  it("does not treat institutional policy pages as factual proof", () => {
    expect(classifySourceUrl("https://empregossaoluis.com.br/politica-editorial")).toBe("INSTITUCIONAL");
    const result = assessEditorialArticle(
      article({
        title: "Regras do 13º salário",
        contentHtml: "<p>O décimo terceiro salário e a CLT exigem atenção.</p>" + "<p>mais texto </p>".repeat(20),
        sourceUrl: "https://empregossaoluis.com.br/politica-editorial",
        sourceName: "Empregos São Luís"
      })
    );
    expect(result.issues.some((item) => item.code === "SOURCE_INTERNAL_AS_FACTUAL")).toBe(true);
    expect(result.classification).toBe("REVISAR MANUALMENTE");
    expect(result.qualityBand).toBe("REVISÃO HUMANA");
  });

  it("flags APPROVED without reviewer as improve (not automatic FACT_REVIEW)", () => {
    const result = assessEditorialArticle(
      article({
        editorialStage: "APPROVED",
        reviewerId: null,
        reviewedAt: null,
        contentHtml:
          "<h2>Como adaptar o PDF</h2><p>Exemplo: liste tarefas reais do comércio.</p>".repeat(30) +
          "<h2>Resumo</h2><p>Próximo passo: revise o objetivo e envie.</p><p><a href=\"/blog/x\">guia</a> <a href=\"/seguranca-candidatos\">segurança</a></p>"
      })
    );
    expect(result.issues.some((item) => item.code === "APPROVED_WITHOUT_REVIEWER")).toBe(true);
    expect(result.classification).not.toBe("REVISAR MANUALMENTE");
  });

  it("does not give 100/MANTER to short template content just above a character floor", () => {
    const result = assessEditorialArticle(
      article({
        contentHtml: `
          <p>${"orientação prática para candidatos locais em São Luís ".repeat(12)}</p>
          <h2>Uma situação comum na prática</h2>
          <p>${"texto auxiliar com utilidade mínima para o leitor ".repeat(10)}</p>
          <h2>Roteiro aplicável passo a passo</h2>
          <p>${"passo útil de candidatura sem inventar estatística ".repeat(10)}</p>
          <h2>Feche o ciclo com uma ação</h2>
          <p>${"ação final objetiva para a semana de busca ".repeat(8)}</p>
        `,
        sourceUrl: "https://empregossaoluis.com.br/politica-editorial",
        sourceName: "Orientação editorial"
      })
    );
    expect(result.wordCount).toBeGreaterThan(300);
    expect(result.wordCount).toBeLessThan(550);
    expect(result.issues.some((item) => item.code === "CONTENT_TEMPLATE_STRUCTURE")).toBe(true);
    expect(result.score).toBeLessThan(70);
    expect(result.classification).not.toBe("MANTER");
    expect(["PRECISA MELHORAR", "BAIXO VALOR"]).toContain(result.qualityBand);
  });

  it("marks technical SEO gaps as auto-fixable", () => {
    const result = assessEditorialArticle(
      article({
        seoTitle: null,
        metaDescription: null,
        coverImageAlt: null
      })
    );
    expect(result.autoFixableCount).toBeGreaterThan(0);
    expect(result.issues.some((item) => item.code === "SEO_TITLE_MISSING" && item.autoFixable)).toBe(true);
  });

  it("returns structured issue fields for editor UI", () => {
    const result = assessEditorialArticle(
      article({
        sourceUrl: "https://empregossaoluis.com.br/politica-editorial",
        seoTitle: null
      })
    );
    for (const issue of result.issues) {
      expect(issue).toEqual(
        expect.objectContaining({
          code: expect.any(String),
          category: expect.any(String),
          title: expect.any(String),
          description: expect.any(String),
          severity: expect.any(String),
          recommendation: expect.any(String),
          autoFixable: expect.any(Boolean),
          impact: expect.any(String),
          status: "PENDENTE"
        })
      );
    }
  });

  it("flags missing cover as IMAGEM issue without mass noindex", () => {
    const result = assessEditorialArticle(article({ coverImageUrl: null, coverImageAlt: null }));
    expect(result.issues.some((item) => item.code === "COVER_MISSING" && item.category === "IMAGEM")).toBe(true);
    expect(result.classification).not.toBe("NOINDEX");
  });

  it("can classify deep original practical guide as BOM/EXCELENTE", () => {
    const body = [
      "<p>Introdução útil sobre objetivo profissional no currículo para quem busca emprego em São Luís.</p>",
      "<h2>O que escrever em duas linhas</h2>",
      "<p>Exemplo sólido: auxiliar administrativo com atendimento em comércio.</p>",
      "<p>Exemplo fraco: profissional dinâmico em busca de desafios.</p>",
      "<h2>Passo a passo</h2>",
      "<ol><li>Leia a vaga</li><li>Corte clichês</li><li>Inclua prova concreta</li></ol>",
      "<h2>Erros comuns</h2>",
      "<p>Objetivo genérico demais reduz confiança do recrutador.</p>",
      "<h2>Resumo</h2>",
      "<p>Próximo passo: adapte a frase à vaga desta semana e revise o PDF.</p>",
      '<p>Veja também <a href="/blog/curriculo-ats-palavras-chave-sao-luis">currículo ATS</a> e <a href="/seguranca-candidatos">segurança</a>.</p>'
    ].join("") + `<p>${"detalhe prático aplicável ao perfil iniciante e à transição de área na capital maranhense. ".repeat(55)}</p>`;
    const result = assessEditorialArticle(
      article({
        title: "Como escrever o objetivo profissional no currículo",
        contentHtml: body,
        sourceUrl: "https://empregossaoluis.com.br/politica-editorial",
        sourceName: "Orientação editorial"
      })
    );
    expect(result.issues.some((item) => item.code === "CONTENT_TEMPLATE_STRUCTURE")).toBe(false);
    expect(result.wordCount).toBeGreaterThan(650);
    expect(["BOM", "EXCELENTE"]).toContain(result.qualityBand);
    expect(result.score).toBeGreaterThanOrEqual(78);
  });
});
