import { describe, expect, it } from "vitest";
import { getEditorialContentOverride } from "../data/editorial-content-overrides";

const textOnly = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

describe("revisões editoriais substanciais para AdSense", () => {
  it("substitui o primeiro artigo prioritário por conteúdo verificável e útil", () => {
    const override = getEditorialContentOverride("busca-emprego-sao-luis-2026");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^\"]+)"/g)].map((match) => match[1]);

    expect(override?.reviewedAt).toBe("2026-10-12");
    expect(words).toBeGreaterThanOrEqual(900);
    expect(new Set(outbound).size).toBeGreaterThanOrEqual(4);
    expect(html).toContain("gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine");
    expect(html).toContain("ibge.gov.br/cidades-e-estados/ma/sao-luis.html");
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/ferramentas/custo-deslocamento"');
    expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
    expect(html).not.toMatch(/R\$\s*\d|salário médio|vagas abertas hoje/i);
  });

  it("não altera artigos ainda não revisados", () => {
    expect(getEditorialContentOverride("salario-custo-de-vida-sao-luis")).toBeNull();
  });
});
