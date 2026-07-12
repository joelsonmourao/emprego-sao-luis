import { describe, expect, it } from "vitest";
import { buildJobPosting } from "./index.js";
const input = { title: "Assistente", description: "Descrição completa", publishedAt: new Date(), expiresAt: new Date(Date.now() + 86400000), employmentType: "FULL_TIME", workplaceType: "presencial", companyName: "Empresa Real", cityName: "São Luís", stateCode: "MA", applicationUrl: "https://example.com/apply", salaryCurrency: "BRL" };
describe("JobPosting", () => {
  it("uses the hiring company and omits absent salary", () => { const result = buildJobPosting(input)!; expect(result.hiringOrganization.name).toBe("Empresa Real"); expect(result).not.toHaveProperty("baseSalary"); });
  it("does not generate schema for expired jobs", () => expect(buildJobPosting({ ...input, expiresAt: new Date(0) })).toBeNull());
  it("marks remote jobs correctly", () => expect(buildJobPosting({ ...input, workplaceType: "remoto" })).toHaveProperty("jobLocationType", "TELECOMMUTE"));
});
