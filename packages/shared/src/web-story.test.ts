import { describe, expect, it } from "vitest";
import { canDuplicateWebStoryAsDraft, validateWebStory } from "./web-story.js";

describe("web stories", () => {
  it("rejects mass-style incomplete stories", () => {
    const result = validateWebStory({
      title: "Story",
      slug: "story",
      pages: [{ order: 1, headline: "Oi" }],
      sourceArticleEligible: false
    });
    expect(result.valid).toBe(false);
    expect(result.autoPublishAllowed).toBe(false);
  });

  it("accepts a narrative draft from an eligible article", () => {
    const result = validateWebStory({
      title: "Como evitar golpes em vagas na Grande Ilha",
      slug: "golpes-vagas-grande-ilha",
      articleId: "art-1",
      authorId: "author-1",
      reviewerId: "rev-1",
      status: "APPROVED",
      posterUrl: "/media/poster.jpg",
      posterAlt: "Alerta de segurança",
      canonicalUrl: "https://empregossaoluis.com.br/web-stories/golpes-vagas-grande-ilha",
      sourceArticleEligible: true,
      pages: [
        { order: 1, headline: "Golpes em vagas locais", body: "Sinais de alerta" },
        { order: 2, headline: "Nunca pague para trabalhar", body: "Regra central" },
        { order: 3, headline: "Leia o guia completo", body: "Contexto ampliado", imageUrl: "/a.jpg", imageAlt: "Guia" }
      ]
    });
    expect(result.valid).toBe(true);
    expect(canDuplicateWebStoryAsDraft("PUBLISHED")).toBe(true);
  });
});
