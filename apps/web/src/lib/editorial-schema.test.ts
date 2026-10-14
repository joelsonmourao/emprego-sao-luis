import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildEditorialSchema, buildNewsroomOrganization, extractExternalEditorialCitations, isNewsroomAuthor } from "./editorial-schema";

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
  it("recognizes only the institutional newsroom signature", () => {
    expect(isNewsroomAuthor("Redação Empregos São Luís")).toBe(true);
    expect(isNewsroomAuthor("  ")).toBe(true);
    expect(isNewsroomAuthor("Maria Silva")).toBe(false);
  });

  it("represents the newsroom as an organization with a real profile page", () => {
    const schema = buildEditorialSchema(base);
    expect(schema.author).toEqual({
      "@type": "Organization",
      "@id": "https://empregossaoluis.com.br/redacao#organization",
      name: "Redação Empregos São Luís",
      url: "https://empregossaoluis.com.br/redacao"
    });
    expect(schema.isAccessibleForFree).toBe(true);
  });

  it("uses the same newsroom entity on articles and the institutional profile", () => {
    const newsroom = buildNewsroomOrganization("https://empregossaoluis.com.br/");
    expect(newsroom).toEqual({
      "@type": "Organization",
      "@id": "https://empregossaoluis.com.br/redacao#organization",
      name: "Redação Empregos São Luís",
      url: "https://empregossaoluis.com.br/redacao"
    });

    const institutionalPage = readFileSync(resolve("apps/web/src/components/InstitutionalPage.astro"), "utf8");
    expect(institutionalPage).toContain('slug === "redacao" ? "ProfilePage"');
    expect(institutionalPage).toContain("buildNewsroomOrganization(getRuntimeSiteUrl(Astro.site).toString())");
    expect(institutionalPage).toContain("pageSchemaMainEntity={pageSchemaMainEntity}");
  });

  it("extracts only visible, unique and external HTTPS citations", () => {
    const citations = extractExternalEditorialCitations(`
      <p><a href="https://www.planalto.gov.br/lei?x=1&amp;y=2#trecho">Lei</a></p>
      <p><a href='https://www.planalto.gov.br/lei?x=1&amp;y=2'>Lei repetida</a></p>
      <p><a href="https://empregossaoluis.com.br/contato">Interno</a></p>
      <p><a href="http://example.com/inseguro">HTTP</a></p>
      <p><a href="mailto:redacao@example.com">E-mail</a></p>
    `, base.siteUrl);

    expect(citations).toEqual(["https://www.planalto.gov.br/lei?x=1&y=2"]);
    expect(buildEditorialSchema({ ...base, citations })).toHaveProperty("citation", citations);
  });

  it("drops invalid, internal and non-HTTPS citations passed directly to the schema", () => {
    const schema = buildEditorialSchema({
      ...base,
      citations: [
        "https://www.gov.br/trabalho",
        "https://www.gov.br/trabalho#secao",
        "http://example.com/inseguro",
        "https://empregossaoluis.com.br/contato",
        "não é URL"
      ]
    });

    expect(schema.citation).toEqual([
      "https://www.gov.br/trabalho",
      "https://www.gov.br/trabalho"
    ]);
  });

  it("does not invent a publication date", () => {
    expect(buildEditorialSchema({ ...base, publishedAt: null })).not.toHaveProperty("datePublished");
  });

  it("uses the real newsroom identity when a legacy row has no author", () => {
    expect(buildEditorialSchema({ ...base, authorName: "  " })).toHaveProperty("author", {
      "@type": "Organization",
      "@id": "https://empregossaoluis.com.br/redacao#organization",
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

  it("uses the audited schema builder in guides and news instead of inline legacy authors", () => {
    const pages = [
      readFileSync(resolve("apps/web/src/pages/blog/[slug].astro"), "utf8"),
      readFileSync(resolve("apps/web/src/pages/noticias/[slug].astro"), "utf8")
    ];

    for (const page of pages) {
      expect(page).toContain('import { buildEditorialSchema, extractExternalEditorialCitations, isNewsroomAuthor } from "../../lib/editorial-schema"');
      expect(page).toContain("buildEditorialSchema({");
      expect(page).toContain("updatedAt: reviewedAt ?? article.updatedAt");
      expect(page).toContain("extractExternalEditorialCitations(contentHtml, runtimeSite.toString())");
      expect(page).toContain("...(citations.length ? { citations } : {})");
      expect(page).not.toContain('author: { "@type": "Person", name: authorName }');
      expect(page).toContain('href="/redacao"');
      expect(page).toContain('rel="author"');
    }
  });
});
