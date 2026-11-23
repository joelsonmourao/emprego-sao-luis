import { describe, expect, it } from "vitest";
import {
  portalSafeHrefForJobBoardPath,
  resolveLogoAltForPortal,
  rewriteJobBoardLinksForPortal
} from "./portal-content-rewrite";

describe("portal content rewrite", () => {
  it("rewrites job-board hrefs to editorial destinations", () => {
    const html =
      '<p>Compare vagas abertas na <a href="/vagas">página de vagas</a> e veja <a href="/blog/x">guia</a>.</p>';
    const out = rewriteJobBoardLinksForPortal(html);
    expect(out).toContain('href="/blog"');
    expect(out).not.toContain('href="/vagas"');
    expect(out).toContain("blog de carreira");
  });

  it("maps publicar-vaga to contato", () => {
    expect(portalSafeHrefForJobBoardPath("/publicar-vaga")).toBe("/contato");
    expect(rewriteJobBoardLinksForPortal('<a href="/publicar-vaga">x</a>')).toContain('href="/contato"');
  });

  it("replaces logo ALT that mentions vagas when portal is on", () => {
    const alt = resolveLogoAltForPortal("Empregos São Luís — vagas em São Luís e Maranhão", true);
    expect(alt.toLowerCase()).not.toContain("vagas");
    expect(resolveLogoAltForPortal("Empregos São Luís — vagas em São Luís", false)).toContain("vagas");
  });
});
