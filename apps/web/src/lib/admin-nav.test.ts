import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_DAY_OPS, ADMIN_NAV_GROUPS, filterDayOps } from "./admin-nav";

const webRoot = resolve("apps/web/src/pages");

function adminPageExists(href: string) {
  const path = href.replace(/^\//, "");
  const candidates = [resolve(webRoot, `${path}.astro`), resolve(webRoot, path, "index.astro")];
  return candidates.some((file) => existsSync(file));
}

describe("admin navigation", () => {
  it("coloca Operação do dia no topo com as 6 ações", () => {
    expect(ADMIN_NAV_GROUPS[0]?.title).toBe("Operação do dia");
    expect(ADMIN_DAY_OPS).toHaveLength(6);
    const dayHrefs = ADMIN_NAV_GROUPS[0]!.items.map((i) => i.href);
    expect(dayHrefs).toContain("/admin/vagas/importar");
    expect(dayHrefs).toContain("/admin/vagas/revisao");
    expect(dayHrefs).toContain("/admin/vagas/monitor-candidaturas");
    expect(dayHrefs).toContain("/admin/conteudo/post-magnetico");
    expect(dayHrefs).toContain("/admin/adsense-readiness");
    expect(dayHrefs).toContain("/admin/comercial/planos");
  });

  it("agrupa Blog Fantasma e Mais ferramentas", () => {
    const titles = ADMIN_NAV_GROUPS.map((g) => g.title);
    expect(titles).toContain("Conteúdo (Blog Fantasma)");
    expect(titles).toContain("Mais ferramentas");
    expect(titles).toContain("Monetização B2B");
  });

  it("inclui módulos comercial e continuidade no menu", () => {
    const hrefs = ADMIN_NAV_GROUPS.flatMap((g) => g.items.map((i) => i.href));
    for (const href of [
      "/admin/comercial/planos",
      "/admin/comercial/reembolsos",
      "/admin/seo/auditoria",
      "/admin/configuracoes/identidade-visual",
      "/admin/contatos",
      "/admin/vagas/importar",
      "/admin/instagram",
      "/admin/vagas/importar-contatos",
      "/admin/vagas/revisao",
      "/admin/vagas/monitor-candidaturas",
      "/admin/conteudo/pilares",
      "/admin/conteudo/post-magnetico",
      "/admin/adsense-readiness",
      "/admin/integracoes",
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
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("cada item do menu aponta para página existente", () => {
    const missing = ADMIN_NAV_GROUPS.flatMap((g) => g.items)
      .filter((item) => !adminPageExists(item.href))
      .map((item) => item.href);
    expect(missing).toEqual([]);
  });

  it("filterDayOps respeita permissões", () => {
    expect(filterDayOps([])).toEqual([]);
    expect(filterDayOps(["imports.manage"]).map((i) => i.href)).toEqual(["/admin/vagas/importar"]);
  });

  it("AdminLayout usa grupos de menu", () => {
    const layout = readFileSync(resolve("apps/web/src/layouts/AdminLayout.astro"), "utf8");
    expect(layout).toContain("filterAdminNav");
    expect(layout).toContain("navGroups.map");
    expect(layout).toContain("BrandLogo");
  });

  it("dashboard destaca Operação do dia", () => {
    const dash = readFileSync(resolve("apps/web/src/pages/admin/index.astro"), "utf8");
    expect(dash).toContain("filterDayOps");
    expect(dash).toContain("Operação do dia");
    expect(dash).toContain("Passo");
  });
});
