import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldUseSecureCookies } from "./cookie-policy";

afterEach(() => vi.unstubAllEnvs());

describe("cookie policy", () => {
  it("mantém Secure por padrão em produção", () => {
    vi.stubEnv("COOKIE_SECURE", "");
    expect(shouldUseSecureCookies(true)).toBe(true);
  });

  it("permite HTTP apenas quando explicitamente desativado", () => {
    vi.stubEnv("COOKIE_SECURE", "false");
    expect(shouldUseSecureCookies(true)).toBe(false);
    expect(shouldUseSecureCookies(false)).toBe(false);
  });
});
