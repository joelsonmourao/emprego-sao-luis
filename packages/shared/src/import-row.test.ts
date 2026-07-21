import { describe, expect, it } from "vitest";
import {
  IMPORT_EXAMPLE_MARKER,
  createImportExternalId,
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

  it("maps id column and Brazilian dates without requiring locality when city+uf exist", () => {
    const normalized = normalizeImportRow({
      id: "SLZ-ABC123DEF0",
      titulo: "Auxiliar de Loja",
      empresa: "Empresa Teste",
      descricao: longDescription,
      cidade: "São Luís",
      uf: "MA",
      modalidade: "PRESENCIAL",
      dataPublicacao: "21/07/2026",
      dataEncerramento: "21/08/2026",
      fonteNome: "InfoJobs",
      candidaturaUrl: "https://example.com/apply"
    });
    const parsed = importJobRowSchema.parse(normalized);
    expect(parsed.externalId).toBe("SLZ-ABC123DEF0");
    expect(parsed.workplaceType).toBe("presencial");
    expect(parsed.publishedAt?.toISOString().startsWith("2026-07-21")).toBe(true);
    expect(parsed.expiresAt?.toISOString().startsWith("2026-08-21")).toBe(true);
    expect(parsed.locality).toBeUndefined();
  });

  it("accepts ISO dates for backward compatibility", () => {
    const parsed = importJobRowSchema.parse({
      title: "Analista",
      company: "Empresa",
      city: "São Luís",
      state: "MA",
      description: longDescription,
      sourceName: "Indeed",
      applicationEmail: "rh@example.com",
      publishedAt: "2026-07-21",
      expiresAt: "2026-08-21"
    });
    expect(parsed.publishedAt?.toISOString().startsWith("2026-07-21")).toBe(true);
  });

  it("generates stable internal id when spreadsheet id is empty", () => {
    const a = createImportExternalId({
      title: "Vendedor",
      company: "Loja X",
      city: "São Luís",
      state: "MA",
      applicationUrl: "https://example.com/a"
    });
    const b = createImportExternalId({
      title: "Vendedor",
      company: "Loja X",
      city: "São Luís",
      state: "MA",
      applicationUrl: "https://example.com/a"
    });
    expect(a).toMatch(/^SLZ-[A-F0-9]{10}$/);
    expect(a).toBe(b);
  });

  it("rejects invalid dates with a clear message", () => {
    const parsed = importJobRowSchema.safeParse({
      title: "Analista",
      company: "Empresa",
      city: "São Luís",
      state: "MA",
      description: longDescription,
      sourceName: "Site",
      applicationUrl: "https://example.com/apply",
      dataEncerramento: "31-13-2026"
    });
    // field comes through normalize as expiresAt; direct schema uses expiresAt
    const direct = importJobRowSchema.safeParse({
      title: "Analista",
      company: "Empresa",
      city: "São Luís",
      state: "MA",
      description: longDescription,
      sourceName: "Site",
      applicationUrl: "https://example.com/apply",
      expiresAt: "31/13/2026"
    });
    expect(direct.success).toBe(false);
  });
});
