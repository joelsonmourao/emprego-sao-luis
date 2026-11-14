import { describe, expect, it } from "vitest";
import { isConfidentialCompanyName, normalizeEntityKey } from "./import-ensure.js";

describe("import ensure helpers", () => {
  it("detects confidential company labels", () => {
    expect(isConfidentialCompanyName("Confidencial")).toBe(true);
    expect(isConfidentialCompanyName("Empresa Confidencial")).toBe(true);
    expect(isConfidentialCompanyName("Lojas Grupo Casas Bahia")).toBe(false);
  });

  it("normalizes entity keys", () => {
    expect(normalizeEntityKey("  São Luís  ")).toBe("sao luis");
  });
});
