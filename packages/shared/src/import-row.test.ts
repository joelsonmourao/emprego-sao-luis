import { describe, expect, it } from "vitest";
import { importJobRowSchema, importModeSchema, normalizeImportRow } from "./index.js";

describe("spreadsheet import", () => {
  it("maps Portuguese headers without losing source fields", () => {
    const normalized = normalizeImportRow({ "Título": "Assistente", Empresa: "Empresa Teste", Cidade: "São Luís", UF: "ma", Descrição: "Descrição suficientemente detalhada para representar fielmente a oportunidade publicada pela empresa.", "Link de candidatura": "https://example.com/apply", Fonte: "Site oficial", Validade: new Date(Date.now() + 86400000) });
    expect(normalized).toMatchObject({ title: "Assistente", company: "Empresa Teste", state: "ma" });
    expect(importJobRowSchema.safeParse(normalized).success).toBe(true);
  });
  it("rejects rows without a useful description", () => expect(importJobRowSchema.safeParse(normalizeImportRow({ Título: "Assistente" })).success).toBe(false));
  it("supports a no-write dry run", () => expect(importModeSchema.parse("DRY_RUN")).toBe("DRY_RUN"));
});
