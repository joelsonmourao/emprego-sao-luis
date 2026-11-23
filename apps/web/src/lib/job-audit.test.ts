import { describe, expect, it } from "vitest";
import { assessJobQuality, type JobAuditRow } from "./job-audit";

function row(overrides: Record<string, unknown> = {}, rowOverrides: Partial<JobAuditRow> = {}): JobAuditRow {
  const job = {
    id: "j-1", publicCode: "ES-000001", slug: "assistente-acme", originalTitle: "Assistente administrativo", normalizedTitle: "Assistente administrativo",
    workplaceType: "presencial", applicationType: "URL", canonicalUrl: "https://empregossaoluis.com.br/vagas/assistente-acme",
    confidentialCompany: false, sourceName: "Carreiras ACME", sourceUrl: "https://careers.acme.com.br/vaga", applicationUrl: "https://careers.acme.com.br/candidatura",
    applicationEmail: null, applicationWhatsapp: null, salaryMin: "1800", salaryMax: "2500", salaryVisible: true,
    salaryPeriod: "MONTH", salaryCurrency: "BRL", descriptionHtml: `<p>${"Descrição útil da oportunidade com responsabilidades e condições. ".repeat(4)}</p>`,
    employmentType: "CLT", requirements: ["Ensino médio"], benefits: ["Vale-transporte"], expiresAt: new Date("2027-01-01"),
    publicationStatus: "PUBLISHED", publishedAt: new Date("2026-01-01"), verificationStatus: "VERIFIED", unidentifiedCompany: false,
    duplicateHash: "hash-1", applicationUrlStatus: "ACTIVE", ...overrides
  } as JobAuditRow["job"];
  return { job, companyName: "ACME", cityName: "São Luís", cityActive: true, stateCode: "MA", categoryName: "Administrativo", ...rowOverrides };
}

describe("job audit", () => {
  it("aceita uma vaga completa e compatível com JobPosting", () => {
    const result = assessJobQuality(row(), 1, new Date("2026-08-01"));
    expect(result.complete).toBe(true);
    expect(result.locationStatus).toBe("VALIDADA");
    expect(result.salaryStatus).toBe("VALIDADO");
    expect(result.jobPostingCompatible).toBe(true);
  });

  it("sinaliza salário suspeito, localização inválida, expiração e candidatura ausente", () => {
    const result = assessJobQuality(row({ salaryMin: "500000", salaryMax: "100", applicationUrl: null, expiresAt: new Date("2025-01-01") }, { cityName: "Shopping da Ilha" }), 2, new Date("2026-08-01"));
    expect(result.salaryStatus).toBe("SUSPEITO");
    expect(result.locationStatus).toBe("INVÁLIDA");
    expect(result.expired).toBe(true);
    expect(result.duplicate).toBe(true);
    expect(result.complete).toBe(false);
  });

  it("não aceita URL de fonte local, privada ou reservada como evidência pública", () => {
    for (const sourceUrl of ["http://localhost/vaga", "http://192.168.1.2/vaga", "https://acme.example/vaga"]) {
      const result = assessJobQuality(row({ sourceUrl }), 1, new Date("2026-08-01"));
      expect(result.issues.some((issue) => issue.code === "SOURCE_MISSING" && issue.severity === "BLOCKER")).toBe(true);
    }
  });
});
