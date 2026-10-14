import { describe, expect, it } from "vitest";
import { getEditorialContentOverride } from "../data/editorial-content-overrides";

const textOnly = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

describe("revisões editoriais substanciais para AdSense", () => {
  it("substitui o primeiro artigo prioritário por conteúdo verificável e útil", () => {
    const override = getEditorialContentOverride("busca-emprego-sao-luis-2026");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

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

  it("revisa o segundo artigo prioritário com rotina local e fontes oficiais", () => {
    const override = getEditorialContentOverride("organizar-busca-emprego");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

    expect(override?.reviewedAt).toBe("2026-10-12");
    expect(words).toBeGreaterThanOrEqual(1100);
    expect(new Set(outbound).size).toBeGreaterThanOrEqual(5);
    expect(html).toContain("buscar-emprego-no-sistema-nacional-de-emprego-sine");
    expect(html).toContain("portal-emprega-brasil");
    expect(html).toContain("BIMn37.pdf");
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/ferramentas/custo-deslocamento"');
    expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
    expect(html).not.toMatch(/salário médio|vagas abertas hoje|empresas contratando agora/i);
  });

  it("revisa o terceiro artigo prioritário com uso responsável do LinkedIn", () => {
    const override = getEditorialContentOverride("linkedin-primeiro-emprego");
    expect(override).not.toBeNull();
    const html = override?.contentHtml ?? "";
    const words = textOnly(html).split(/\s+/).filter(Boolean).length;
    const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

    expect(override?.reviewedAt).toBe("2026-10-14");
    expect(words).toBeGreaterThanOrEqual(1200);
    expect(new Set(outbound).size).toBeGreaterThanOrEqual(5);
    expect(html).toContain("linkedin.com/help/linkedin/answer/a554351");
    expect(html).toContain("linkedin.com/help/linkedin/answer/a1420165");
    expect(html).toContain("linkedin.com/help/linkedin/answer/a518980");
    expect(html).toContain("linkedin.com/help/linkedin/answer/a1338436");
    expect(html).toContain("buscar-emprego-no-sistema-nacional-de-emprego-sine");
    expect(html).toContain('href="/ferramentas/controle-candidaturas"');
    expect(html).toContain('href="/guias/emprego-sine-maranhao"');
    expect(html).toContain('href="/blog/objetivo-profissional-curriculo"');
    expect(html).not.toContain('href="/blog/objetivo-profissional"');
    expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
    expect(html).not.toMatch(/salário médio|vagas abertas hoje|empresas contratando agora|contratação garantida/i);
  });

  it("revisa o lote residual que estava sem fonte externa", () => {
    const residual = [
      "perguntas-comuns-entrevista-emprego",
      "objetivo-profissional-curriculo",
      "salario-custo-de-vida-sao-luis",
      "comparar-portais-emprego-seguranca",
      "quantas-vagas-candidatar-por-semana",
      "vagas-comercio-servicos-sao-luis-perfil",
      "mapa-setores-vagas-sao-luis"
    ];

    for (const slug of residual) {
      const override = getEditorialContentOverride(slug);
      const words = textOnly(override?.contentHtml ?? "").split(/\s+/).filter(Boolean);
      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(500);
      expect(override?.contentHtml).toMatch(/<a href="https:\/\//);
      expect(override?.contentHtml).not.toMatch(/No tema em pauta|Leitura útil do cenário/i);
    }
  });

  it("aprofunda os quatro guias trabalhistas mais curtos com fontes oficiais", () => {
    const laborGuides = [
      "seguro-desemprego-checklist-documentos",
      "ctps-digital-carteira-trabalho-consultar",
      "fgts-consultar-trabalhador-clt",
      "ler-contrato-trabalho-clt"
    ];

    for (const slug of laborGuides) {
      const override = getEditorialContentOverride(slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(550);
      expect(html).toMatch(/<a href="https:\/\//);
      expect(html).toMatch(/gov\.br|fgts\.gov\.br|planalto\.gov\.br/);
      expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida/i);
    }
  });

  it("aprofunda oito guias trabalhistas com revisão individual e fontes oficiais", () => {
    const laborGuides = [
      "trabalhar-fim-de-semana-folga-adicional",
      "convencao-coletiva-holerite-trabalhador",
      "periodo-experiencia-clt-o-que-saber",
      "abono-pecuniario-ferias-holerite",
      "trabalho-noturno-adicional-o-que-perguntar",
      "hora-extra-holerite-como-conferir",
      "retorno-trabalho-apos-maternidade",
      "escala-6x1-o-que-perguntar"
    ];

    for (const slug of laborGuides) {
      const override = getEditorialContentOverride(slug);
      const html = override?.contentHtml ?? "";
      const words = textOnly(html).split(/\s+/).filter(Boolean);
      const outbound = [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map((match) => match[1]);

      expect(override).not.toBeNull();
      expect(override?.reviewedAt).toBe("2026-10-14");
      expect(words.length).toBeGreaterThanOrEqual(550);
      expect(new Set(outbound).size).toBeGreaterThanOrEqual(2);
      expect(outbound.every((url) => /https:\/\/(?:www\.)?(?:gov\.br|planalto\.gov\.br)\//.test(url))).toBe(true);
      expect(html).not.toMatch(/uma situação comum na prática|roteiro aplicável passo a passo|feche o ciclo com uma ação/i);
      expect(html).not.toMatch(/vagas abertas hoje|salário médio|contratação garantida/i);
    }
  });
});
