import { describe, expect, it } from "vitest";
import { buildEditorialSchema } from "./editorial-schema";

const base = {
  type: "Article" as const,
  title: "Guia local",
  description: "Informação útil",
  canonical: "https://empregossaoluis.com.br/blog/guia-local",
  authorName: "Redação Empregos São Luís",
  publishedAt: new Date("2026-08-01T12:00:00Z"),
  updatedAt: new Date("2026-08-02T12:00:00Z"),
  siteUrl: "https://empregossaoluis.com.br"
};

describe("editorial structured data", () => {
  it("represents the newsroom as an organization with a real profile page", () => {
    const schema = buildEditorialSchema(base);
    expect(schema.author).toEqual({
      "@type": "Organization",
      name: "Redação Empregos São Luís",
      url: "https://empregossaoluis.com.br/redacao"
    });
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it("does not invent a publication date", () => {
    expect(buildEditorialSchema({ ...base, publishedAt: null })).not.toHaveProperty("datePublished");
  });

  it("uses the real newsroom identity when a legacy row has no author", () => {
    expect(buildEditorialSchema({ ...base, authorName: "  " })).toHaveProperty("author", {
      "@type": "Organization",
      name: "Redação Empregos São Luís",
      url: "https://empregossaoluis.com.br/redacao"
    });
  });

  it("never reports a modification before publication", () => {
    const schema = buildEditorialSchema({
      ...base,
      updatedAt: new Date("2026-07-01T12:00:00Z")
    });
    expect(schema.dateModified).toBe(base.publishedAt.toISOString());
  });
});
