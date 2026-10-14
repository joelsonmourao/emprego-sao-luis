import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getEditorialCoverMetadata } from "./editorial-cover-metadata";

describe("metadados públicos das capas editoriais próprias", () => {
  it("substitui crédito legado somente para um arquivo auditado do mesmo slug", () => {
    expect(
      getEditorialCoverMetadata(
        "pesquisar-empresa-antes-entrevista",
        "https://empregossaoluis.com.br/covers/adsense-quality/pesquisar-empresa-antes-entrevista.webp"
      )
    ).toMatchObject({
      licenseStatus: "owned",
      width: 1280,
      height: 720,
      credit: "Ilustração editorial original: Empregos São Luís"
    });

    expect(
      getEditorialCoverMetadata(
        "documentos-admissao-emprego-maranhao",
        "/covers/sl-local/documentos-admissao-emprego-maranhao.webp"
      )
    ).toMatchObject({ licenseStatus: "owned", width: 1200, height: 630 });
  });

  it("não atribui direitos quando slug, caminho ou pacote divergem", () => {
    expect(
      getEditorialCoverMetadata(
        "documentos-admissao-emprego-maranhao",
        "/covers/sl-local/freelancer-ou-clt-vantagens.webp"
      )
    ).toBeNull();
    expect(
      getEditorialCoverMetadata("documentos-admissao-emprego-maranhao", "https://images.example/capa.webp")
    ).toBeNull();
    expect(
      getEditorialCoverMetadata("slug-inexistente", "/covers/sl-local/slug-inexistente.webp")
    ).toBeNull();
  });

  it("aplica o manifesto auditado em guias e notícias, inclusive no JSON-LD", () => {
    const pages = [
      readFileSync(resolve("apps/web/src/pages/blog/[slug].astro"), "utf8"),
      readFileSync(resolve("apps/web/src/pages/noticias/[slug].astro"), "utf8")
    ];

    for (const page of pages) {
      expect(page).toContain(
        'import { getEditorialCoverMetadata } from "../../lib/editorial-cover-metadata"'
      );
      expect(page).toContain("getEditorialCoverMetadata(article.slug, article.coverImageUrl)");
      expect(page).toContain("effectiveCoverCaption");
      expect(page).toContain("effectiveCoverCredit");
    }
  });
});
