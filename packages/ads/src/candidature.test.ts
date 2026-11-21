import { describe, expect, it } from "vitest";
import { CANDIDATURE_BLOCKED_SLOT_KEYS, assertSlotNotNearCandidature, isSlotAllowedOnJobPage } from "./index.js";

describe("regra de candidatura", () => {
  it("bloqueia slots proibidos perto da candidatura", () => {
    expect(CANDIDATURE_BLOCKED_SLOT_KEYS.has("job-after-application")).toBe(true);
    expect(isSlotAllowedOnJobPage("job-after-application")).toBe(false);
  });

  it("permite slots seguros na página de vaga", () => {
    expect(isSlotAllowedOnJobPage("job-sidebar")).toBe(true);
    expect(isSlotAllowedOnJobPage("job-content-mid")).toBe(true);
  });

  it("lança erro ao tentar usar slot bloqueado em página de vaga", () => {
    expect(() => assertSlotNotNearCandidature("job-after-application", "job")).toThrow();
    expect(() => assertSlotNotNearCandidature("job-sidebar", "job")).not.toThrow();
  });
});
