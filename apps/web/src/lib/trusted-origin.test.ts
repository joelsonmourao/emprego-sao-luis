import { describe, expect, it } from "vitest";
import { isTrustedApiOrigin } from "./trusted-origin";

describe("trusted-origin", () => {
  it("aceita Origin igual ao host reconstruído pelo proxy", () => {
    expect(isTrustedApiOrigin("https://empregossaoluis.com.br", "https://empregossaoluis.com.br")).toBe(true);
  });

  it("bloqueia Origin malicioso", () => {
    expect(isTrustedApiOrigin("https://site-malicioso.example", "https://empregossaoluis.com.br")).toBe(false);
  });

  it("aceita ausência de Origin", () => {
    expect(isTrustedApiOrigin(null, "https://empregossaoluis.com.br")).toBe(true);
  });
});
