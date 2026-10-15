import { describe, expect, it } from "vitest";
import { buildSitemapIndex, buildUrlSet, chunkEntries, dedupeEntries } from "./sitemaps.js";

describe("sitemaps", () => {
  it("builds a sitemap index", () => {
    const xml = buildSitemapIndex([{ loc: "https://example.com/sitemaps/jobs.xml", lastmod: "2026-01-01T00:00:00.000Z" }]);
    expect(xml).toContain("<sitemapindex");
    expect(xml).toContain("https://example.com/sitemaps/jobs.xml");
  });

  it("dedupes entries by location", () => {
    const entries = dedupeEntries([
      { loc: "https://example.com/a", lastmod: "2026-01-01T00:00:00.000Z" },
      { loc: "https://example.com/a", lastmod: "2026-01-02T00:00:00.000Z" }
    ]);
    expect(entries).toHaveLength(1);
  });

  it("chunks large lists", () => {
    const chunks = chunkEntries(Array.from({ length: 5 }, (_, index) => index), 2);
    expect(chunks).toEqual([[0, 1], [2, 3], [4]]);
  });

  it("escapes xml in urlset", () => {
    const xml = buildUrlSet([{ loc: "https://example.com/?a=1&b=2" }]);
    expect(xml).toContain("&amp;");
  });
});
