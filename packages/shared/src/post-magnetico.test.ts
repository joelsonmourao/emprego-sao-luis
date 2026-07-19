import { describe, expect, it } from "vitest";
import { scorePostMagnetico, validatePostMagneticoForReview } from "./post-magnetico.js";

const richBody = `<h2>Contexto em São Luís</h2><p>${"Orientação prática para candidatos da Grande Ilha. ".repeat(40)}</p><ul><li>Passo 1</li><li>Passo 2</li></ul>`;

describe("post magnetico", () => {
  it("blocks weak generic drafts", () => {
    const result = validatePostMagneticoForReview({
      title: "Dicas de emprego",
      excerpt: "Veja dicas",
      contentHtml: "<p>Texto curto</p>"
    });
    expect(result.valid).toBe(false);
    expect(result.score.total).toBeLessThan(70);
  });

  it("scores a complete local package without claiming Google ranking", () => {
    const score = scorePostMagnetico({
      title: "Como se candidatar por WhatsApp em São Luís",
      excerpt: "Passo a passo gratuito para candidatos da Grande Ilha.",
      contentHtml: richBody,
      directAnswer: "Use o número oficial da vaga e envie currículo apenas após confirmar a empresa.",
      localHook: "Em São Luís, muitas vagas locais ainda usam WhatsApp como canal principal.",
      intent: "orientar",
      pillarId: "p1",
      clusterId: "c1",
      sources: [{ name: "Fonte local" }],
      coverImageUrl: "/media/a.jpg",
      coverImageAlt: "Candidato em São Luís",
      authorId: "a1",
      reviewerId: "r1",
      faqJson: [{ q: "É gratuito?", a: "Sim." }],
      candidateCta: "Buscar vagas gratuitas",
      internalLinkCount: 2
    });
    expect(score.publishableInternally).toBe(true);
    expect(score.disclaimer).toContain("Não representa pontuação do Google");
  });
});
