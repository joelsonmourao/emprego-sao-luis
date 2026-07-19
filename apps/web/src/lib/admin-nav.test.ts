import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { ADMIN_NAV_GROUPS } from "./admin-nav";

const webRoot = resolve("apps/web/src/pages");

function adminPageExists(href: string) {
  const path = href.replace(/^\//, "");
  const candidates = [
    resolve(webRoot, `${path}.astro`),
    resolve(webRoot, path, "index.astro")
  ];
  return candidates.some((file) => existsSync(file));
}

describe("admin navigation", () => {
  it("organiza menu em módulos, não lista única", () => {
    expect(ADMIN_NAV_GROUPS.length).toBeGreaterThanOrEqual(10);
    const allItems = ADMIN_NAV_GROUPS.flatMap((g) => g.items);
    expect(allItems.length).toBeGreaterThan(15);
    expect(new Set(allItems.map((i) => i.href)).size).toBe(allItems.length);
  });

  it("inclui módulos comercial e instagram", () => {
    const labels = ADMIN_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
    expect(labels).toContain("/admin/comercial/planos");
    expect(labels).toContain("/admin/comercial/reembolsos");
    expect(labels).toContain("/admin/seo/auditoria");
    expect(labels).toContain("/admin/configuracoes/identidade-visual");
    expect(labels).toContain("/admin/contatos");
    expect(labels).toContain("/admin/vagas/importar");
    expect(labels).toContain("/admin/instagram");
  });

  it("inclui áreas de continuidade do negócio no menu", () => {
    const hrefs = ADMIN_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
    for (const href of [
      "/admin/vagas/importar-contatos",
      "/admin/vagas/revisao",
      "/admin/vagas/monitor-candidaturas",
      "/admin/conteudo/pilares",
      "/admin/conteudo/post-magnetico",
      "/admin/adsense-readiness",
      "/admin/web-stories",
      "/admin/calendario-editorial",
      "/admin/autores",
      "/admin/fontes",
      "/admin/seo/links-internos",
      "/admin/seo/canibalizacao",
      "/admin/vagas-patrocinadas",
      "/admin/perfis-empresariais",
      "/admin/conteudo-patrocinado",
      "/admin/automacoes-editoriais"
    ]) {
      expect(hrefs).toContain(href);
    }
  });

  it("cada item do menu aponta para página existente", () => {
    const missing = ADMIN_NAV_GROUPS.flatMap((g) => g.items)
      .filter((item) => !adminPageExists(item.href))
      .map((item) => item.href);
    expect(missing).toEqual([]);
  });

  it("AdminLayout usa grupos de menu", () => {
    const layout = readFileSync(resolve("apps/web/src/layouts/AdminLayout.astro"), "utf8");
    expect(layout).toContain("filterAdminNav");
    expect(layout).toContain("navGroups.map");
    expect(layout).toContain("BrandLogo");
  });
});
