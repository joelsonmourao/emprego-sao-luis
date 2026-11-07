import { describe, expect, it } from "vitest";
import { splitImportQualityErrors } from "./import-quality.js";

describe("splitImportQualityErrors", () => {
  it("keeps only hard blockers for spreadsheet import", () => {
    const { blocking, soft } = splitImportQualityErrors([
      "Título e descrição não apresentam correspondência suficiente.",
      "Empresa não cadastrada.",
      "Informe ao menos uma candidatura válida por site, WhatsApp ou e-mail.",
      "Categoria incompatível com o conteúdo; sugestão: Comércio."
    ]);
    expect(blocking).toEqual(["Informe ao menos uma candidatura válida por site, WhatsApp ou e-mail."]);
    expect(soft).toContain("Título e descrição não apresentam correspondência suficiente.");
    expect(soft).toContain("Empresa não cadastrada.");
  });
});
