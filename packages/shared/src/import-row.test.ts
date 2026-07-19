import { describe, expect, it } from "vitest";
import {
  IMPORT_EXAMPLE_MARKER,
  importJobRowSchema,
  importModeSchema,
  normalizeImportRow,
  shouldSkipImportRow,
  suggestImportMapping
} from "./index.js";

const longDescription =
  "Descrição suficientemente detalhada para representar a oportunidade, suas atividades, requisitos e contexto de contratação de forma verificável.";

describe("spreadsheet import", () => {
  it("maps Portuguese aliases and accepts a URL application", () => {
    const normalized = normalizeImportRow({
      "Título": "Assistente Administrativo",
      Empresa: "Empresa Teste",
      Cidade: "São Luís",
      UF: "ma",
      Descrição: longDescription,
      "Link de candidatura": "https://example.com/apply",
      Fonte: "Site oficial"
    });

    expect(normalized).toMatchObject({
      title: "Assistente Administrativo",
      company: "Empresa Teste",
      state: "ma",
      applicationUrl: "https://example.com/apply",
      sourceName: "Site oficial"
    });
    expect(importJobRowSchema.safeParse(normalized).success).toBe(true);
  });

  it("accepts e-mail or WhatsApp without requiring category and neighborhood", () => {
    const base = {
      title: "Analista Financeiro",
      company: "Empresa",
      locality: "São Luís - MA",
      description: longDescription,
      sourceName: "Site da empresa"
    };
    expect(importJobRowSchema.safeParse({ ...base, applicationEmail: "rh@example.com" }).success).toBe(true);
    expect(importJobRowSchema.safeParse({ ...base, applicationWhatsapp: "(98) 99999-1234" }).success).toBe(true);
  });

  it("rejects rows without any valid application channel", () => {
    const parsed = importJobRowSchema.safeParse({
      title: "Analista Financeiro",
      company: "Empresa",
      city: "São Luís",
      state: "MA",
      description: longDescription,
      sourceName: "Site da empresa",
      applicationEmail: "invalido"
    });
    expect(parsed.success).toBe(false);
  });

  it("never accepts direct publication as an import mode", () => {
    expect(importModeSchema.parse("DRY_RUN")).toBe("DRY_RUN");
    expect(importModeSchema.safeParse("PUBLISHED").success).toBe(false);
  });

  it("suggests reusable mappings from normalized aliases", () => {
    expect(suggestImportMapping(["Cargo", "Empresa", "UF", "E-mail", "WhatsApp"])).toEqual({
      title: "Cargo",
      company: "Empresa",
      state: "UF",
      applicationEmail: "E-mail",
      applicationWhatsapp: "WhatsApp"
    });
  });

  it("skips the protected template example row", () => {
    expect(shouldSkipImportRow({ observacoes: IMPORT_EXAMPLE_MARKER })).toBe(true);
  });

  it("preserves optional operational fields and salary values", () => {
    const parsed = importJobRowSchema.parse(normalizeImportRow({
      "Título original": "  ANALISTA DE SUPORTE I  ",
      "Título público": "Analista de Suporte",
      Empresa: "Empresa Auditada",
      Cidade: "São Luís",
      Estado: "ma",
      Bairro: "Centro",
      Modalidade: "Híbrido",
      "Tipo de contratação": "CLT",
      Descrição: longDescription,
      Salário: "R$ 2.500,00",
      "Salário mínimo": "R$ 2.500,00",
      "Salário máximo": "R$ 3.000,00",
      "URL da candidatura": "https://example.com/candidatura",
      Fonte: "Site oficial",
      "Código externo": "EXT-123"
    }));

    expect(parsed).toMatchObject({
      originalTitle: "ANALISTA DE SUPORTE I",
      title: "Analista de Suporte",
      neighborhood: "Centro",
      workplaceType: "hibrido",
      employmentType: "CLT",
      salaryMin: 2500,
      salaryMax: 3000,
      externalId: "EXT-123"
    });
  });

  it("rejects an inverted salary range", () => {
    expect(importJobRowSchema.safeParse({
      title: "Analista Financeiro",
      company: "Empresa",
      city: "São Luís",
      state: "MA",
      description: longDescription,
      applicationUrl: "https://example.com/apply",
      sourceName: "Site oficial",
      salaryMin: "3000",
      salaryMax: "2000"
    }).success).toBe(false);
  });
});
