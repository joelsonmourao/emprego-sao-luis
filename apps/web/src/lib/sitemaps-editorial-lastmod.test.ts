import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveEditorialSitemapUpdatedAt } from "./sitemaps";

describe("editorial sitemap lastmod", () => {
  const databaseDate = new Date("2026-08-01T12:00:00Z");

  it("uses a later audited review date for revised articles", () => {
    expect(resolveEditorialSitemapUpdatedAt(databaseDate, "2026-10-13").toISOString())
      .toBe("2026-10-13T15:00:00.000Z");
  });

  it("never moves lastmod backwards when the database is newer", () => {
    const newerDatabaseDate = new Date("2026-10-14T18:00:00Z");
    expect(resolveEditorialSitemapUpdatedAt(newerDatabaseDate, "2026-10-13"))
      .toBe(newerDatabaseDate);
  });

  it("falls back safely when the review date is absent or invalid", () => {
    expect(resolveEditorialSitemapUpdatedAt(databaseDate)).toBe(databaseDate);
    expect(resolveEditorialSitemapUpdatedAt(databaseDate, "invalid")).toBe(databaseDate);
  });

  it("applies the reviewedAt value to blog and news sitemap entries", () => {
    const source = readFileSync(resolve("apps/web/src/lib/sitemaps.ts"), "utf8");
    expect(source).toContain(
      "resolveEditorialSitemapUpdatedAt(row.updatedAt, editorialRevision?.reviewedAt)"
    );
  });
});
