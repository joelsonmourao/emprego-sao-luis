import { describe, expect, it } from "vitest";
import { parseArticleForm } from "./admin-article-input";

function validForm() {
  const form = new FormData();
  form.set("type", "NEWS");
  form.set("authorId", "11111111-1111-4111-8111-111111111111");
  form.set("title", "Nova oportunidade em São Luís");
  form.set("excerpt", "Resumo completo da notícia publicada.");
  form.set("contentHtml", "<p>Conteúdo editorial completo para publicação.</p>");
  form.set("status", "DRAFT");
  return form;
}

describe("article form", () => {
  it("gera slug e aceita rascunho", () => {
    const parsed = parseArticleForm(validForm());
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.data.slug).toBe("nova-oportunidade-em-sao-luis");
  });

  it("exige alt quando existe imagem", () => {
    const form = validForm();
    form.set("coverImageUrl", "https://example.com/capa.png");
    const parsed = parseArticleForm(form);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.error).toContain("alternativo");
  });

  it("rejeita agendamento no passado", () => {
    const form = validForm();
    form.set("status", "SCHEDULED");
    form.set("scheduledAt", "2025-01-01T10:00");
    expect(parseArticleForm(form, new Date("2026-01-01T00:00:00Z")).ok).toBe(false);
  });
});
