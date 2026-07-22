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
  it("uses the hiring company and puts baseSalary value 0 when salary absent", () => {
    const result = buildJobPosting(input)!;
    expect(result.hiringOrganization.name).toBe("Empresa Real");
    expect(result.baseSalary).toEqual({
      "@type": "MonetaryAmount",
      currency: "BRL",
      value: { "@type": "QuantitativeValue", value: "0" }
    });
    expect(result.identifier).toEqual({ "@type": "PropertyValue", name: "Código ES", value: "ES-000123" });
    expect(result).not.toHaveProperty("directApply");
  });

  it("fills address defaults and identifier value 0 when missing", () => {
    const result = buildJobPosting({ ...input, publicCode: "" })!;
    expect(result.identifier.value).toBe(0);
    expect(result.jobLocation.address.streetAddress).toBe("Não Informado");
    expect(result.jobLocation.address.postalCode).toBe("Não Informado");
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
    expect(buildJobPosting({ ...input, workplaceType: "remoto" })).toHaveProperty(
      "jobLocationType",
      "TELECOMMUTE"
    ));

  it("reports missing fields in validation", () => {
    const result = validateJobPosting({ ...input, publicCode: "", canonicalUrl: "" });
    expect(result.valid).toBe(false);
    expect(result.missing).not.toContain("identifier");
    expect(result.missing).toContain("canonicalUrl");
  });

  it("uses both brand logos on hiringOrganization", () => {
    const result = buildJobPosting(input)!;
    expect(result.hiringOrganization.logo).toEqual([
      { "@type": "ImageObject", url: "https://empregossaoluis.com.br/brand/icon.webp" },
      { "@type": "ImageObject", url: "https://empregossaoluis.com.br/favicon.svg" }
    ]);
  });

  it("puts QuantitativeValue value 0 when salary amounts are missing", () => {
    const result = buildJobPosting({ ...input, salaryVisible: true })!;
    expect(result.baseSalary.value).toEqual(
      expect.objectContaining({ "@type": "QuantitativeValue", value: "0" })
    );
  });

  it("keeps min/max when salary is informed", () => {
    const result = buildJobPosting({
      ...input,
      salaryVisible: true,
      salaryMin: "1500",
      salaryMax: "2000",
      salaryPeriod: "MONTH"
    })!;
    expect(result.baseSalary.value).toEqual({
      "@type": "QuantitativeValue",
      minValue: 1500,
      maxValue: 2000,
      unitText: "MONTH"
    });
  });
});
