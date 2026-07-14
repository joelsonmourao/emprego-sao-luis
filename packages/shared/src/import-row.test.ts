import { describe, expect, it } from "vitest";
import { importJobRowSchema, importModeSchema, normalizeImportRow, suggestImportMapping } from "./index.js";

describe("spreadsheet import", () => {
  it("maps Portuguese headers without losing source fields", () => {
    const normalized = normalizeImportRow({ "Título": "Assistente", Empresa: "Empresa Teste", Cidade: "São Luís", UF: "ma", Descrição: "Descrição suficientemente detalhada para representar fielmente a oportunidade publicada pela empresa.", "Link de candidatura": "https://example.com/apply", Fonte: "Site oficial", Validade: new Date(Date.now() + 86400000) });
    expect(normalized).toMatchObject({ title: "Assistente", company: "Empresa Teste", state: "ma" });
    expect(importJobRowSchema.safeParse(normalized).success).toBe(true);
  });
  it("rejects rows without a useful description", () => expect(importJobRowSchema.safeParse(normalizeImportRow({ Título: "Assistente" })).success).toBe(false));
  it("supports a no-write dry run", () => expect(importModeSchema.parse("DRY_RUN")).toBe("DRY_RUN"));
  it("suggests reusable mappings from normalized aliases", () => expect(suggestImportMapping(["Cargo", "Empresa", "UF", "Link de candidatura"])).toEqual({ title: "Cargo", company: "Empresa", state: "UF", applyUrl: "Link de candidatura" }));

  it("preserva o conjunto editorial e operacional completo", () => {
    const normalized = normalizeImportRow({
      "Título original": "  ANALISTA DE SUPORTE I  ",
      "Título público": "Analista de Suporte",
      Empresa: "Empresa Auditada",
      Categoria: "Tecnologia",
      Cidade: "São Luís",
      Estado: "ma",
      Bairro: "Centro",
      Modalidade: "Híbrido",
      "Tipo de contratação": "CLT",
      Descrição: "Descrição completa com atividades, contexto e informações suficientes para validar a oportunidade importada.",
      Resumo: "Resumo público da oportunidade.",
      Atividades: "Atender usuários\nDocumentar chamados",
      Requisitos: "Ensino médio\nBoa comunicação",
      Benefícios: "Vale-transporte\nPlano de saúde",
      Salário: "R$ 2.500,00",
      "Salário máximo": "R$ 3.000,00",
      "URL da candidatura": "https://example.com/candidatura",
      Fonte: "Site oficial",
      "URL da fonte": "https://example.com/vaga",
      Data: "2026-07-13",
      Validade: "2026-08-13",
      Status: "aberta",
      Destaque: "sim",
      "Código externo": "EXT-123"
    });
    const parsed = importJobRowSchema.parse(normalized);

    expect(parsed).toMatchObject({
      originalTitle: "ANALISTA DE SUPORTE I",
      title: "Analista de Suporte",
      neighborhood: "Centro",
      workplaceType: "hibrido",
      employmentType: "CLT",
      salaryMin: 2500,
      salaryMax: 3000,
      featured: true,
      externalId: "EXT-123"
    });
  });

  it("rejeita faixa salarial invertida", () => {
    const row = {
      title: "Analista",
      company: "Empresa",
      city: "São Luís",
      state: "MA",
      description: "Descrição completa com conteúdo suficiente para a validação de importação da oportunidade publicada.",
      applyUrl: "https://example.com/apply",
      source: "Site oficial",
      expiresAt: "2026-08-13",
      salaryMin: "3000",
      salaryMax: "2000"
    };
    expect(importJobRowSchema.safeParse(row).success).toBe(false);
  });
});
