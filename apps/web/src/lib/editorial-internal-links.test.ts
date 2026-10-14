import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type GuideAudit = { findings: Array<{ slug: string }> };
type NewsAudit = { news: Array<{ url: string }> };

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(resolve(path), "utf8")) as T;

const guideSlugs = new Set(
  [
    ...readJson<GuideAudit>("reports/adsense-revisao-integral-parte-1.json").findings,
    ...readJson<GuideAudit>("reports/adsense-revisao-integral-parte-2.json").findings
  ].map((item) => item.slug)
);

const newsSlugs = new Set(
  readJson<NewsAudit>("reports/adsense-noticias-revisao-20261012.json").news.map(
    (item) => new URL(item.url).pathname.split("/").filter(Boolean).at(-1) ?? ""
  )
);

const editorialSources = [
  "apps/web/src/data/editorial-content-overrides.ts",
  "apps/web/src/data/news-editorial-content-overrides.ts"
];

describe("links internos do corpus editorial revisado", () => {
  it("aponta links editoriais para artigos ou páginas públicas existentes", () => {
    const links = editorialSources.flatMap((path) => {
      const source = readFileSync(resolve(path), "utf8");
      return [...source.matchAll(/href="(\/[^"#?]+)(?:[?#][^"]*)?"/g)].map((match) => ({
        href: match[1],
        source: path
      }));
    });

    expect(links.length).toBeGreaterThan(0);

    const broken = links.filter(({ href }) => {
      const [, section, slug] = href.match(/^\/(blog|noticias)\/([^/]+)$/) ?? [];

      if (section === "blog") return !guideSlugs.has(slug);
      if (section === "noticias") return !newsSlugs.has(slug);

      const route = href === "/" ? "index" : href.replace(/^\//, "").replace(/\/$/, "");
      return ![
        `apps/web/src/pages/${route}.astro`,
        `apps/web/src/pages/${route}.ts`,
        `apps/web/src/pages/${route}/index.astro`,
        `apps/web/src/pages/${route}/index.ts`
      ].some((candidate) => existsSync(resolve(candidate)));
    });

    expect(broken).toEqual([]);
  });
});
