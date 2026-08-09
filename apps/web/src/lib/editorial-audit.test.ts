import { describe, expect, it } from "vitest";
import { assessEditorialArticle, auditEditorialContent, type EditorialArticle } from "./editorial-audit";

const usefulText = Array.from({ length: 90 }, (_, index) => `${index === 0 ? "Em São Luís," : "Neste guia,"} etapa${index} orientação${index} candidatura${index} conferência${index} contexto${index} documento${index} prazo${index} canal${index} empresa${index} decisão${index} segurança${index} resultado${index}.`).join(" ");

function article(overrides: Partial<EditorialArticle> = {}): EditorialArticle {
  return {
    id: "a-1", title: "Guia local de candidatura", slug: "guia-local", type: "GUIDE", excerpt: "Orientação local",
    contentHtml: `<p>${usefulText}</p><p><a href="/blog/outro-guia">Leia outro guia</a> e consulte <a href="https://www.gov.br/trabalho">a fonte oficial</a>.</p>`,
    primaryKeyword: "candidatura em são luís", pillarId: "p-1", clusterId: "c-1", sourceUrl: "https://www.gov.br/trabalho",
    sources: [{ url: "https://www.gov.br/trabalho" }], authorId: "u-1", authorName: "Redação local", reviewerId: "u-2",
    factCheckedAt: new Date(), publishedAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-02"), status: "PUBLISHED",
    relatedArticleIds: [], relatedJobIds: [], seoTitle: "Guia local", metaDescription: "Guia local e verificável para candidaturas em São Luís.",
    canonicalUrl: null, section: "Carreira", localHook: "Aplicação prática em São Luís", ...overrides
  };
}

describe("editorial audit", () => {
  it("mantém conteúdo substancial e recomenda noindex para página muito fraca", () => {
    expect(assessEditorialArticle(article()).classification).toBe("MANTER");
    const weak = assessEditorialArticle(article({ id: "a-2", contentHtml: "<p>Texto curto.</p>", sourceUrl: null, sources: [], pillarId: null, clusterId: null, metaDescription: null, localHook: null }));
    expect(weak.classification).toBe("NOINDEX");
    expect(weak.indexable).toBe(false);
  });

  it("detecta pares candidatos com shingles e índice invertido", () => {
    const report = auditEditorialContent([article(), article({ id: "a-2", slug: "guia-local-copia", title: "Guia local de candidatura — cópia" })]);
    expect(report.similarities).toHaveLength(1);
    expect(report.similarities[0]!.similarity).toBeGreaterThan(0.7);
    expect(report.assessments.every((item) => item.classification === "REVISAR MANUALMENTE")).toBe(true);
  });

  it("não deixa rascunhos alterarem a classificação ou os links do conteúdo público", () => {
    const published = article();
    const draft = article({
      id: "a-draft",
      slug: "rascunho-copia",
      status: "DRAFT",
      contentHtml: `${published.contentHtml}<p><a href="/blog/inexistente">Link de rascunho</a></p>`
    });
    const report = auditEditorialContent([published, draft]);
    expect(report.assessments.find((item) => item.article.id === published.id)?.classification).toBe("MANTER");
    expect(report.similarities).toHaveLength(0);
    expect(report.brokenLinks).toHaveLength(1);
    expect(report.brokenLinks[0]?.href).toBe("/blog/outro-guia");
  });
});
