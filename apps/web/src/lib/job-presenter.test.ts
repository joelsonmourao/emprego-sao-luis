import { describe, expect, it } from "vitest";
import { formatSalary, formatWorkplace } from "./job-presenter";

describe("job-presenter", () => {
  it("formata salário visível", () => {
    expect(formatSalary({ salaryVisible: true, salaryMin: "2500", salaryMax: "3500", salaryCurrency: "BRL", salaryPeriod: "mensal" })).toContain("R$");
  });

  it("oculta salário quando não visível", () => {
    expect(formatSalary({ salaryVisible: false, salaryMin: "2500", salaryMax: null, salaryCurrency: "BRL", salaryPeriod: null })).toBeNull();
  });

  it("traduz modalidade", () => {
    expect(formatWorkplace("remoto")).toBe("Remoto");
  });
});
