import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { findAutoEditorialArticle, listAutoEditorialArticles } from "./auto-editorial";

const read = (p: string) => readFileSync(resolve(p), "utf8");

describe("Agenda editorial automática com proteção contra publicação prematura", () => {
  it("manifesto não antecipa uma publicação antes do primeiro dia", () => {
    expect(listAutoEditorialArticles(undefined, new Date("2026-10-12T12:00:00Z"))).toEqual([]);
    expect(findAutoEditorialArticle("inexistente")).toBeNull();
  });
  it("a agenda cobre os 80 dias e mantém três horários definidos", () => {
    const c = JSON.parse(read("editorial/calendario-3-artigos-diarios-2026.json")) as {
      days: { date: string; posts: { time: string; slug: string }[] }[];
    };
    expect(c.days).toHaveLength(80);
    expect(c.days[0].date).toBe("2026-10-13");
    expect(c.days.at(-1)?.date).toBe("2026-12-31");
    for (const day of c.days) expect(day.posts.map(p => p.time)).toEqual(["09:00", "13:00", "17:00"]);
  });
  it("o construtor usa fonte real, valida originalidade, data e gera WebP sem API paga", () => {
    const src = read("scripts/build-auto-editorial.mjs");
    expect(src).toContain("meta.planned_date!==day.date");
    expect(src).toContain("meta.planned_time!==post.time");
    expect(src).toContain("words(plain)<460");
    expect(src).toContain("fontes ausentes ou inseguras");
    expect(src).toContain("parágrafos repetidos");
    expect(src).toContain('sharp(Buffer.from(svg)).webp(');
    expect(src).not.toContain("api.openai.com");
    expect(src).not.toContain("delete from");
  });
  it("o site separa automaticamente publicação programada de rascunhos bloqueados", () => {
    const page = read("apps/web/src/pages/blog/[slug].astro");
    const blog = read("apps/web/src/pages/blog/index.astro");
    const sitemap = read("apps/web/src/lib/sitemaps.ts");
    expect(page).toContain("findAutoEditorialArticle(slug)");
    expect(blog).toContain("listAutoEditorialArticles(9)");
    expect(sitemap).toContain("listAutoEditorialArticles()");
    expect(read("apps/web/src/lib/auto-editorial.ts")).toContain("Date.parse(x.publishedAt)<=now.getTime()");
  });
});
