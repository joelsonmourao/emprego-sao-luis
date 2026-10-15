import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (name: string) => readFileSync(resolve(name), "utf8");

describe("AdSense: corrigir baixo valor com utilidade real", () => {
  it("não permite falso positivo pronto quando a auditoria editorial exige revisão", () => {
    const source = read("apps/web/src/lib/adsense-readiness.ts");
    expect(source).toContain('id: "editorial-quality-human"');
    expect(source).toContain('id: "editorial-quality-depth"');
    expect(source).toContain("qualityRequiresReview.length === 0");
    expect(source).toContain("templatedPublished.length === 0");
    expect(source).toContain("needsImprovement.length === 0");
    expect(source).toContain('"/admin/qualidade-editorial"');
  });

  it("fornece ferramenta utilizável, acessível e sem transmissão de candidaturas", () => {
    const page = read("apps/web/src/pages/ferramentas/controle-candidaturas.astro");
    expect(page).toContain('<form id="controle-form"');
    expect(page).toContain('id="controle-exportar"');
    expect(page).toContain('const csv =');
    expect(page).toContain('URL.createObjectURL(blob)');
    expect(page).toContain('cell.textContent = text');
    expect(page).toContain('aria-live="polite"');
    expect(page).not.toContain("fetch(");
    expect(page).not.toContain("localStorage");
    expect(page).not.toContain("innerHTML");
    expect(page).not.toContain("googleadservices");
    const home = read("apps/web/src/pages/index.astro");
    expect(home).toContain('href="/ferramentas/controle-candidaturas"');
  });

  it("explica como fontes e correções devem ser tratadas, sem fingir aprovação", () => {
    const page = read("apps/web/src/components/InstitutionalPage.astro");
    expect(page).toContain('slug === "politica-editorial"');
    expect(page).toContain('slug === "politica-fontes"');
    expect(page).toContain('slug === "politica-correcoes"');
    expect(page).toContain("Uma publicação antiga de rede social não comprova");
    expect(page).toContain('href="/contato"');
  });
});
