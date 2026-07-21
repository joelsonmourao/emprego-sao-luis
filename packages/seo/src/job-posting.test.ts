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
  it("uses the hiring company and omits absent salary", () => {
    const result = buildJobPosting(input)!;
    expect(result.hiringOrganization.name).toBe("Empresa Real");
    expect(result).not.toHaveProperty("baseSalary");
    expect(result.identifier).toEqual({ "@type": "PropertyValue", name: "Código ES", value: "ES-000123" });
    expect(result).not.toHaveProperty("directApply");
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
    expect(result.missing).toContain("identifier");
    expect(result.missing).toContain("canonicalUrl");
  });

  it("includes site logo on hiringOrganization", () => {
    const result = buildJobPosting({
      ...input,
      organizationLogoUrl: "/brand/logo-horizontal.webp"
    })!;
    expect(result.hiringOrganization.logo).toEqual({
      "@type": "ImageObject",
      url: "https://empregossaoluis.com.br/brand/logo-horizontal.webp"
    });
  });
});
