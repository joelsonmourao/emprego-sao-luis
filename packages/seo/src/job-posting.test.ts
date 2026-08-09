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
  it("uses the hiring company and omits salary when the source has no value", () => {
    const result = buildJobPosting(input)!;
    expect(result.hiringOrganization.name).toBe("Empresa Real");
    expect(result).not.toHaveProperty("baseSalary");
    expect(result.identifier).toEqual({ "@type": "PropertyValue", name: "Código ES", value: "ES-000123" });
    expect(result).not.toHaveProperty("directApply");
  });

  it("omits unknown address and identifier fields instead of inventing placeholders", () => {
    const result = buildJobPosting({ ...input, publicCode: "" })!;
    expect(result).not.toHaveProperty("identifier");
    expect(result).not.toHaveProperty("jobLocation.address.streetAddress");
    expect(result).not.toHaveProperty("jobLocation.address.postalCode");
  });

  it("does not generate schema for expired jobs", () =>
    expect(buildJobPosting({ ...input, expiresAt: new Date(0) })).toBeNull());

  it("does not invent an organization for confidential or unidentified jobs", () => {
    expect(buildJobPosting({ ...input, confidentialCompany: true })).toBeNull();
    expect(buildJobPosting({ ...input, unidentifiedCompany: true })).toBeNull();
  });

  it("only marks directApply when explicitly confirmed", () => {
    expect(buildJobPosting({ ...input, directApply: true })).toHaveProperty("directApply", true);
  });

  it("marks remote jobs correctly", () =>
    {
      const result = buildJobPosting({ ...input, workplaceType: "remoto" })!;
      expect(result).toHaveProperty("jobLocationType", "TELECOMMUTE");
      expect(result).not.toHaveProperty("applicantLocationRequirements");
    });

  it("maps Brazilian contract labels to the supported schema.org values", () => {
    expect(buildJobPosting({ ...input, employmentType: "CLT" })).toHaveProperty("employmentType", "FULL_TIME");
    expect(buildJobPosting({ ...input, employmentType: "estágio" })).toHaveProperty("employmentType", "INTERN");
    expect(buildJobPosting({ ...input, employmentType: "modalidade desconhecida" })).toBeNull();
  });

  it("reports missing fields in validation", () => {
    const result = validateJobPosting({ ...input, publicCode: "", canonicalUrl: "" });
    expect(result.valid).toBe(false);
    expect(result.missing).not.toContain("identifier");
    expect(result.missing).toContain("canonicalUrl");
  });

  it("only uses the real hiring organization logo when informed", () => {
    const result = buildJobPosting({ ...input, organizationLogoUrl: "https://cdn.example.com/acme.png" })!;
    expect(result.hiringOrganization.logo).toBe("https://cdn.example.com/acme.png");
    expect(buildJobPosting(input)!.hiringOrganization).not.toHaveProperty("logo");
  });

  it("does not emit baseSalary when visibility is true but values are missing", () => {
    const result = buildJobPosting({ ...input, salaryVisible: true })!;
    expect(result).not.toHaveProperty("baseSalary");
  });

  it("keeps min/max when salary is informed", () => {
    const result = buildJobPosting({
      ...input,
      salaryVisible: true,
      salaryMin: "1500",
      salaryMax: "2000",
      salaryPeriod: "MONTH"
    })!;
    expect(result).toHaveProperty("baseSalary.value", {
      "@type": "QuantitativeValue",
      minValue: 1500,
      maxValue: 2000,
      unitText: "MONTH"
    });
  });

  it("omits salary when its period is not known", () => {
    const result = buildJobPosting({
      ...input,
      salaryVisible: true,
      salaryMin: "1500",
      salaryPeriod: "a combinar"
    })!;
    expect(result).not.toHaveProperty("baseSalary");
  });

  it("does not emit baseSalary for zero or non-positive values", () => {
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

  it("does not emit a JobPosting with a placeholder location or unsafe URL", () => {
    expect(buildJobPosting({ ...input, cityName: "Não informado" })).toBeNull();
    expect(buildJobPosting({ ...input, canonicalUrl: "javascript:alert(1)" })).toBeNull();
    expect(buildJobPosting({ ...input, canonicalUrl: "http://localhost:4321/vagas/assistente" })).toBeNull();
  });
});
