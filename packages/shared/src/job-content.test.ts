import { describe, expect, it } from "vitest";
import { consolidateJobContent } from "./job-content.js";

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
});
