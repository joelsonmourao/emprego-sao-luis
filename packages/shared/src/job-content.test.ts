import { describe, expect, it } from "vitest";
import { consolidateJobContent, formatJobDescriptionHtml, markdownToHtml } from "./job-content.js";

describe("consolidateJobContent", () => {
  it("preserves section order and removes repeated items", () => {
    const result = consolidateJobContent({
      description: "Atuação no atendimento ao público e apoio ao time.",
      activities: "Atender clientes\nOrganizar documentos",
      requirements: "Organizar documentos\nEnsino médio completo",
      benefits: "Vale-transporte"
    });
    expect(result.descriptionHtml.indexOf("Atividades")).toBeLessThan(
      result.descriptionHtml.indexOf("Requisitos")
    );
    expect(result.descriptionHtml.indexOf("Requisitos")).toBeLessThan(
      result.descriptionHtml.indexOf("Benefícios")
    );
    expect(result.descriptionHtml.match(/Organizar documentos/g)).toHaveLength(1);
    expect(result.report.duplicateItemsRemoved).toBe(1);
  });

  it("escapes imported markup", () => {
    const result = consolidateJobContent({
      description: "<script>alert(1)</script>Descrição segura e suficientemente completa para publicação."
    });
    expect(result.descriptionHtml).not.toContain("<script>");
  });

  it("formats markdown lists and headings", () => {
    const html = markdownToHtml("## Requisitos\n- CNH\n- Experiência\n\nTexto final.", {
      baseHeadingLevel: 2
    });
    expect(html).toContain("<h3>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>");
    expect(html).toContain("<p>");
  });

  it("repairs wall-of-text descriptions for display", () => {
    const html = formatJobDescriptionHtml(
      "Atividades:\n- Atender clientes\n- Organizar filas\n\nRequisitos:\n1. Ensino médio"
    );
    expect(html).toContain("<h3>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<ol>");
  });
});
