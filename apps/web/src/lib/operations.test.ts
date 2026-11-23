import { describe, expect, it } from "vitest";
import { sanitizePayload } from "./operations.js";

describe("operations", () => {
  it("oculta campos sensíveis no payload", () => {
    const result = sanitizePayload({ deliveryId: "abc", to: "user@example.com", password: "secret", html: "<p>ok</p>" }) as Record<string, unknown>;
    expect(result.password).toBe("[oculto]");
    expect(result.deliveryId).toBe("abc");
  });
});
