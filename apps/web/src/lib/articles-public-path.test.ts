import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { articlePublicPath } from "./articles";

describe("article public path", () => {
  it("routes news to the news section", () => {
    expect(articlePublicPath("NEWS", "boletim-local")).toBe("/noticias/boletim-local");
  });

  it("routes guides and data reports to the editorial blog", () => {
    expect(articlePublicPath("GUIDE", "curriculo-primeiro-emprego")).toBe(
      "/blog/curriculo-primeiro-emprego"
    );
    expect(articlePublicPath("DATA_REPORT", "mercado-trabalho-maranhao")).toBe(
      "/blog/mercado-trabalho-maranhao"
    );
  });

  it("uses the article type in the RSS feed instead of sending news to /blog", () => {
    const feed = readFileSync(resolve("apps/web/src/pages/feed.xml.ts"), "utf8");
    expect(feed).toContain("articlePublicPath(article.type, article.slug)");
    expect(feed).not.toContain("`/blog/${article.slug}`");
  });
});
