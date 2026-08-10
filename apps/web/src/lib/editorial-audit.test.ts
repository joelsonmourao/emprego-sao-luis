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
    expect(result.classification).not.toBe("MANTER");
  });

  it("flags APPROVED without reviewer as improve (not automatic FACT_REVIEW)", () => {
    const result = assessEditorialArticle(
      article({
        editorialStage: "APPROVED",
        reviewerId: null,
        reviewedAt: null
      })
    );
    expect(result.issues.some((item) => item.code === "APPROVED_WITHOUT_REVIEWER")).toBe(true);
    expect(result.classification).toBe("MELHORAR");
  });

  it("treats short length as auxiliary, not automatic NOINDEX", () => {
    const result = assessEditorialArticle(
      article({
        contentHtml: "<p>" + "palavra ".repeat(60) + "</p>",
        sourceUrl: "https://www.gov.br/trabalho"
      })
    );
    expect(result.charCount).toBeLessThan(800);
    expect(result.issues.some((item) => item.code === "CONTENT_SHORT_AUX")).toBe(true);
    expect(result.classification).not.toBe("NOINDEX");
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
});
