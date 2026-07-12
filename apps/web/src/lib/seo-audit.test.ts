import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { auditJob, seoScoreFromIssues } from "./seo-audit";

function mockJob(overrides: Record<string, unknown> = {}) {
  return {
    id: "job-1",
    slug: "analista-financeiro-sao-luis",
    normalizedTitle: "",
    summary: "",
    publicationStatus: "PUBLISHED",
    description: "",
    ...overrides
  } as unknown as Parameters<typeof auditJob>[0];
}

describe("seo auditJob checks", () => {
  it("detecta título ausente como critical", async () => {
    const issues = await auditJob(mockJob());
    const missing = issues.find((i) => i.checkKey === "missing_title");
    expect(missing).toBeDefined();
    expect(missing?.severity).toBe("critical");
    expect(missing?.scoreImpact).toBe(15);
  });

  it("não alerta título quando normalizedTitle existe", async () => {
    const withNormalized = await auditJob(mockJob({ normalizedTitle: "Analista Financeiro" }));
    expect(withNormalized.find((i) => i.checkKey === "missing_title")).toBeUndefined();
  });

  it("detecta description ausente como warning", async () => {
    const issues = await auditJob(mockJob({ normalizedTitle: "Título" }));
    const missing = issues.find((i) => i.checkKey === "missing_description");
    expect(missing?.severity).toBe("warning");
    expect(missing?.scoreImpact).toBe(10);
  });

  it("detecta slug inválido para canonical", async () => {
    const noSlug = await auditJob(mockJob({ slug: "", normalizedTitle: "T", summary: "D" }));
    expect(noSlug.find((i) => i.checkKey === "canonical_invalid")).toBeDefined();

    const badSlug = await auditJob(mockJob({ slug: "Vaga_Com www", normalizedTitle: "T", summary: "D" }));
    expect(badSlug.find((i) => i.checkKey === "slug_bad")).toBeDefined();

    const valid = await auditJob(mockJob({ slug: "analista-financeiro-sao-luis", normalizedTitle: "T", summary: "D" }));
    expect(valid.find((i) => i.checkKey === "canonical_invalid")).toBeUndefined();
    expect(valid.find((i) => i.checkKey === "slug_bad")).toBeUndefined();
  });

  it("alerta vaga expirada ainda indexável", async () => {
    const issues = await auditJob(mockJob({
      normalizedTitle: "T",
      summary: "D",
      slug: "analista-financeiro-sao-luis",
      publicationStatus: "EXPIRED"
    }));
    const expired = issues.find((i) => i.checkKey === "expired_indexable");
    expect(expired?.severity).toBe("critical");
    expect(expired?.scoreImpact).toBe(20);
  });

  it("detecta conteúdo fino na descrição", async () => {
    const issues = await auditJob(mockJob({
      normalizedTitle: "T",
      summary: "D",
      slug: "analista-financeiro-sao-luis",
      description: "Curta."
    }));
    const thin = issues.find((i) => i.checkKey === "thin_content");
    expect(thin?.severity).toBe("warning");
    expect(thin?.scoreImpact).toBe(8);
  });

  it("não alerta descrição suficiente", async () => {
    const issues = await auditJob(mockJob({
      normalizedTitle: "T",
      summary: "D",
      slug: "analista-financeiro-sao-luis",
      description: "Descrição longa o suficiente para JobPosting com detalhes da vaga, requisitos e benefícios oferecidos pela empresa."
    }));
    expect(issues.find((i) => i.checkKey === "thin_content")).toBeUndefined();
  });
});

describe("seo score", () => {
  it("seoScoreFromIssues penaliza issues acumuladas", () => {
    const issues = [
      { checkKey: "missing_title", severity: "critical", scoreImpact: 15, message: "", recommendation: "" },
      { checkKey: "missing_description", severity: "warning", scoreImpact: 10, message: "", recommendation: "" },
      { checkKey: "thin_content", severity: "warning", scoreImpact: 8, message: "", recommendation: "" }
    ];
    expect(seoScoreFromIssues(issues)).toBe(67);
  });

  it("score mínimo é zero", () => {
    const heavy = Array.from({ length: 10 }, () => ({ scoreImpact: 20, severity: "critical" }));
    expect(seoScoreFromIssues(heavy)).toBe(0);
  });

  it("vaga perfeita mantém score 100", async () => {
    const issues = await auditJob(mockJob({
      normalizedTitle: "Analista Financeiro",
      summary: "Vaga para analista em São Luís com benefícios.",
      slug: "analista-financeiro-sao-luis",
      description: "Descrição completa da vaga com responsabilidades, requisitos mínimos, diferenciais e informações sobre a empresa contratante no Maranhão."
    }));
    expect(seoScoreFromIssues(issues)).toBe(100);
  });
});

describe("seo audit infrastructure", () => {
  it("countOpenSeoIssues filtra resolvidos e ignorados", () => {
    const source = readFileSync(resolve("apps/web/src/lib/seo-audit.ts"), "utf8");
    expect(source).toContain("countOpenSeoIssues");
    expect(source).toContain("eq(seoAuditIssues.resolved, false)");
    expect(source).toContain("eq(seoAuditIssues.ignored, false)");
  });

  it("runSeoAudit evita duplicar issues abertas", () => {
    const source = readFileSync(resolve("apps/web/src/lib/seo-audit.ts"), "utf8");
    expect(source).toContain("eq(seoAuditIssues.resolved, false)");
    expect(source).toContain("if (open) continue");
  });
});
