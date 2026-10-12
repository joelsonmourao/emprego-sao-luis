import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { guidesPendingReview, newsPendingFactCheck, isEditorialReviewPending } from "../data/editorial-review-pending";
import { getEditorialContentOverride } from "../data/editorial-content-overrides";
import { getNewsEditorialOverride } from "../data/news-editorial-content-overrides";

const load = (p: string) => readFileSync(resolve(p), "utf8");
const report = (n: 1 | 2) => JSON.parse(load(`reports/adsense-revisao-integral-parte-${n}.json`)) as {
  findings: { slug: string; words: number; flags: string[]; images: string[] }[];
};
const all = [...report(1).findings, ...report(2).findings];

describe("Auditoria editorial real do corpus de 12/10/2026", () => {
  it("contém evidência individual de todos os 106 guias, sem duplicata", () => {
    expect(all).toHaveLength(106);
    expect(new Set(all.map((x) => x.slug)).size).toBe(106);
    expect(new Set(all.map((x) => x.images[0])).size).toBe(106);
  });

  it("registra exatamente os 98 guias com conteúdo repetitivo ou curto", () => {
    const flagged = all.filter((x) => x.flags.includes("TEMPLATE_REPEATED") || x.flags.includes("SHORT"));
    expect(flagged).toHaveLength(98);
    const reviewed = flagged.filter((item) => getEditorialContentOverride(item.slug));
    const pending = flagged.filter((item) => !getEditorialContentOverride(item.slug));
    expect(reviewed).toHaveLength(20);
    expect(pending).toHaveLength(78);
    expect(guidesPendingReview.size).toBe(pending.length);
    for (const item of pending) expect(guidesPendingReview.has(item.slug)).toBe(true);
    for (const item of reviewed) expect(guidesPendingReview.has(item.slug)).toBe(false);
  });

  it("não usa um único noindex genérico: cada slug possui evidência registrada", () => {
    for (const item of all) {
      const flagged = item.flags.includes("TEMPLATE_REPEATED") || item.flags.includes("SHORT");
      const expected = flagged && !getEditorialContentOverride(item.slug);
      expect(isEditorialReviewPending("GUIDE", item.slug)).toBe(expected);
    }
    expect(newsPendingFactCheck.size).toBe(5);
  });

  it("revisões de guias possuem conteúdo específico e não repetem o template antigo", () => {
    const edited = [
      "mensagem-fria-recrutador-linkedin", "acompanhar-candidatura-emprego",
      "pesquisar-empresa-antes-entrevista", "seguro-desemprego-checklist-documentos",
      "ctps-digital-carteira-trabalho-consultar", "fgts-consultar-trabalhador-clt",
      "ler-contrato-trabalho-clt", "curriculo-pdf-erros-triagem",
      "entrevista-comportamental-exemplos", "primeiro-emprego-sao-luis-checklist",
      "acidente-de-trabalho-o-que-fazer", "assedio-no-trabalho-o-que-fazer",
      "atestado-medico-trabalho-como-entregar", "banco-de-horas-direitos-trabalhador",
      "convencao-coletiva-holerite-trabalhador", "escala-6x1-o-que-perguntar",
      "hora-extra-holerite-como-conferir", "pedido-demissao-aviso-previo-acerto"
    ];
    for (const slug of edited) {
      const override = getEditorialContentOverride(slug);
      expect(override).not.toBeNull();
      expect(override!.contentHtml.length).toBeGreaterThan(1200);
      expect(override!.contentHtml).not.toContain("Uma situação comum na prática");
      expect(override!.contentHtml).not.toContain("No tema em pauta");
      expect(override!.contentHtml).toContain("<h2>");
    }

    const sourceBacked = [
      "acidente-de-trabalho-o-que-fazer", "assedio-no-trabalho-o-que-fazer",
      "atestado-medico-trabalho-como-entregar", "banco-de-horas-direitos-trabalhador",
      "convencao-coletiva-holerite-trabalhador", "escala-6x1-o-que-perguntar",
      "hora-extra-holerite-como-conferir", "pedido-demissao-aviso-previo-acerto"
    ];
    for (const slug of sourceBacked) {
      expect(getEditorialContentOverride(slug)!.contentHtml).toMatch(/<a href="https:\/\//);
    }
  });

  it("cinco notícias antigas possuem revisões factuais próprias e referências identificáveis", () => {
    for (const slug of newsPendingFactCheck) {
      const revised = getNewsEditorialOverride(slug);
      expect(revised).not.toBeNull();
      expect(revised!.contentHtml.length).toBeGreaterThan(1600);
      expect(revised!.contentHtml).toMatch(/<a href="https:\/\/(?:www\.)?(?:gov\.br|planalto\.gov\.br)/);
      expect(revised!.contentHtml).not.toContain("No tema em pauta");
    }
  });

  it("não monetiza artigos pendentes marcados noindex", () => {
    const layout = load("apps/web/src/layouts/BaseLayout.astro");
    expect(layout).toContain("!noindex && !/");
    expect(layout).toContain("adsWanted");
  });

  it("noindex individual e sitemap utilizam a mesma classificação e exceção revisada", () => {
    const blog = load("apps/web/src/pages/blog/[slug].astro");
    const news = load("apps/web/src/pages/noticias/[slug].astro");
    const sitemap = load("apps/web/src/lib/sitemaps.ts");
    expect(blog).toContain("noindex={editorialNoindex}");
    expect(news).toContain("noindex={editorialNoindex}");
    expect(blog).toContain("getEditorialContentOverride");
    expect(news).toContain("getNewsEditorialOverride");
    expect(sitemap).toContain("isEditorialReviewPending(row.type, row.slug)");
    expect(sitemap).toContain("getNewsEditorialOverride");
  });
});
