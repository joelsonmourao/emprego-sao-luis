import { describe, expect, it } from "vitest";
import {
  buildMailtoUrl,
  buildWhatsappUrl,
  normalizeApplicationEmail,
  normalizeApplicationUrl,
  normalizeApplicationWhatsapp,
  validateApplicationChannels
} from "./index.js";

describe("application channels", () => {
  it("normalizes a Brazilian mobile number without losing its DDD", () => {
    expect(normalizeApplicationWhatsapp("(98) 99999-1234")).toMatchObject({
      valid: true,
      normalized: "5598999991234"
    });
  });

  it("preserves an explicitly international number", () => {
    expect(normalizeApplicationWhatsapp("+55 98 99999-1234").normalized).toBe("5598999991234");
  });

  it("rejects malformed or suspicious values", () => {
    expect(normalizeApplicationWhatsapp("99999999999").valid).toBe(false);
    expect(normalizeApplicationEmail("rh@example").valid).toBe(false);
    expect(normalizeApplicationUrl("javascript:alert(1)").valid).toBe(false);
  });

  it("keeps every valid channel instead of choosing only one", () => {
    const result = validateApplicationChannels({
      applicationUrl: "https://example.com/vaga",
      applicationEmail: "RH@Example.com",
      applicationWhatsapp: "(98) 99999-1234"
    });
    expect(result.validTypes).toEqual(["URL", "WHATSAPP", "EMAIL"]);
    expect(result.email.normalized).toBe("RH@example.com");
  });

  it("builds safe explicit WhatsApp and e-mail destinations", () => {
    expect(buildWhatsappUrl("(98) 99999-1234", "Tenho interesse")).toContain("wa.me/5598999991234");
    expect(buildMailtoUrl("rh@example.com", "Candidatura – Analista")).toBe(
      "mailto:rh@example.com?subject=Candidatura%20%E2%80%93%20Analista"
    );
  });

  it.each([
    ["url only", { applicationUrl: "https://example.com/vaga" }, ["URL"]],
    ["whatsapp only", { applicationWhatsapp: "(98) 98888-1234" }, ["WHATSAPP"]],
    ["email only", { applicationEmail: "rh@empresa.com" }, ["EMAIL"]],
    ["url+whatsapp", { applicationUrl: "https://example.com/vaga", applicationWhatsapp: "(98) 98888-1234" }, ["URL", "WHATSAPP"]],
    ["url+email", { applicationUrl: "https://example.com/vaga", applicationEmail: "rh@empresa.com" }, ["URL", "EMAIL"]],
    ["whatsapp+email", { applicationWhatsapp: "(98) 98888-1234", applicationEmail: "rh@empresa.com" }, ["WHATSAPP", "EMAIL"]],
    [
      "all three",
      {
        applicationUrl: "https://example.com/vaga",
        applicationWhatsapp: "(98) 98888-1234",
        applicationEmail: "rh@empresa.com"
      },
      ["URL", "WHATSAPP", "EMAIL"]
    ]
  ] as const)("accepts combination: %s", (_label, input, expected) => {
    expect(validateApplicationChannels(input).validTypes).toEqual([...expected]);
  });
});
