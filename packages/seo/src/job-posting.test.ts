import { describe, expect, it } from "vitest";
import { buildJobPosting, validateJobPosting } from "./index.js";

const input = {
  title: "Assistente",
  description: "Descrição completa",
  publishedAt: new Date(),
  expiresAt: new Date(Date.now() + 86400000),
  employmentType: "FULL_TIME",
  workplaceType: "presencial",
  companyName: "Empresa Real",
  cityName: "São Luís",
  stateCode: "MA",
  applicationUrl: "https://example.com/apply",
  applicationType: "URL",
  salaryCurrency: "BRL",
  publicCode: "ES-000123",
  canonicalUrl: "https://empregossaoluis.com.br/vagas/assistente"
};

describe("JobPosting", () => {
  it("omits salary and placeholders when data is missing", () => {
    const result = buildJobPosting(input)!;
    expect(result.hiringOrganization.name).toBe("Empresa Real");
    expect(result).not.toHaveProperty("baseSalary");
    expect(result).not.toHaveProperty("jobLocation.address.streetAddress");
    expect(result).not.toHaveProperty("jobLocation.address.postalCode");
    expect(result.hiringOrganization).not.toHaveProperty("logo");
    expect(result).not.toHaveProperty("directApply");
  });

  it("does not emit salary 0", () => {
    expect(
      buildJobPosting({
        ...input,
        salaryVisible: true,
        salaryMin: "0",
        salaryMax: "0",
        salaryPeriod: "MONTH"
      })
    ).not.toHaveProperty("baseSalary");
  });

  it("does not invent placeholders for location", () => {
    expect(buildJobPosting({ ...input, cityName: "Não Informado" })).toBeNull();
  });

  it("maps Brazilian employment labels and omits unknown", () => {
    expect(buildJobPosting({ ...input, employmentType: "CLT" })).toHaveProperty("employmentType", "FULL_TIME");
    expect(buildJobPosting({ ...input, employmentType: "desconhecido" })).toBeNull();
  });

  it("omits JobPosting for confidential companies", () => {
    expect(buildJobPosting({ ...input, confidentialCompany: true })).toBeNull();
  });

  it("validateJobPosting reports missing canonical", () => {
    const result = validateJobPosting({ ...input, canonicalUrl: "" });
    expect(result.valid).toBe(false);
    expect(result.missing).toContain("canonicalUrl");
  });
});
