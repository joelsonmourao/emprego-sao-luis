import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_DAY_OPS, ADMIN_NAV_GROUPS, filterAdminNav, filterDayOps, findAdminNavContext } from "./admin-nav";

const webRoot = resolve("apps/web/src/pages");

function adminPageExists(href: string) {
  const path = href.split(/[?#]/)[0]!.replace(/^\//, "");
  return [resolve(webRoot, `${path}.astro`), resolve(webRoot, path, "index.astro")].some((file) => existsSync(file));
}

describe("admin navigation", () => {
  it("organiza o menu pela nova arquitetura operacional", () => {
    expect(ADMIN_NAV_GROUPS.map((group) => group.title)).toEqual([
      "Visão geral", "Conteúdo", "Publicação", "Qualidade", "SEO & Google", "AdSense", "Operação", "Negócio", "Sistema"
    ]);
    expect(ADMIN_DAY_OPS).toHaveLength(4);
    expect(ADMIN_DAY_OPS.map((item) => item.href)).toEqual([
      "/admin/vagas/importar", "/admin/qualidade-vagas", "/admin/conteudo", "/admin/adsense-readiness"
    ]);
  });

  it("inclui as áreas críticas sem duplicar links", () => {
    const hrefs = ADMIN_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href));
    for (const href of [
      "/admin/qualidade-vagas", "/admin/qualidade-editorial", "/admin/adsense-readiness",
      "/admin/seo/auditoria#google-jobs", "/admin/conteudo/pilares", "/admin/comercial/planos",
      "/admin/publicidade", "/admin/perfis-empresariais", "/admin/integracoes"
    ]) expect(hrefs).toContain(href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("aponta cada item para uma página Astro existente", () => {
    const missing = ADMIN_NAV_GROUPS.flatMap((group) => group.items).filter((item) => !adminPageExists(item.href)).map((item) => item.href);
    expect(missing).toEqual([]);
  });

  it("respeita permissões nas prioridades", () => {
    expect(filterDayOps([])).toEqual([]);
    expect(filterDayOps(["imports.manage"]).map((item) => item.href)).toEqual(["/admin/vagas/importar"]);
  });

  it("não deduz super admin pela quantidade de permissões", () => {
    const manyPermissions = ["settings.manage", ...Array.from({ length: 12 }, (_, index) => `custom.${index}`)];
    const regularHrefs = filterAdminNav(manyPermissions).flatMap((group) => group.items.map((item) => item.href));
    expect(regularHrefs).not.toContain("/admin/vagas");
    const superHrefs = filterAdminNav([], ["SUPER_ADMIN"]).flatMap((group) => group.items.map((item) => item.href));
    expect(superHrefs).toContain("/admin/vagas");
  });

  it("seleciona a rota mais específica para breadcrumbs e item ativo", () => {
    expect(findAdminNavContext("/admin/vagas/importar")?.item.label).toBe("Importações");
    expect(findAdminNavContext("/admin/conteudo", "?tipo=noticias")?.item.label).toBe("Notícias");
  });

  it("mantém navegação responsiva e dashboard operacional", () => {
    const layout = readFileSync(resolve("apps/web/src/layouts/AdminLayout.astro"), "utf8");
    const dashboard = readFileSync(resolve("apps/web/src/pages/admin/index.astro"), "utf8");
    expect(layout).toContain("filterAdminNav");
    expect(layout).toContain("admin-sidebar-collapse");
    expect(layout).toContain("aria-label=\"Painel administrativo\"");
    expect(dashboard).toContain("Ações prioritárias");
    expect(dashboard).toContain("Central AdSense");
  });
});
