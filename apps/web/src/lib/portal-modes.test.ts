import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  editorialBlogThemeHref,
  getPublicNav,
  isJobBoardPublicPath,
  isJobBoardPubliclyActive,
  resolveEditorialBlogTheme,
  sitemapCategoryAllowedWhenPortalEditorial,
  staticPathAllowedWhenPortalEditorial
} from "./portal-modes";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

describe("portal modes", () => {
  it("pauses public job board only when editorial portal mode is on", () => {
    expect(isJobBoardPubliclyActive(false)).toBe(true);
    expect(isJobBoardPubliclyActive(true)).toBe(false);
  });

  it("identifies job-board public paths", () => {
    expect(isJobBoardPublicPath("/vagas")).toBe(true);
    expect(isJobBoardPublicPath("/vagas/foo")).toBe(true);
    expect(isJobBoardPublicPath("/empresas/acme")).toBe(true);
    expect(isJobBoardPublicPath("/categorias")).toBe(true);
    expect(isJobBoardPublicPath("/publicar-vaga")).toBe(true);
    expect(isJobBoardPublicPath("/i")).toBe(true);
    expect(isJobBoardPublicPath("/i/ES-000001")).toBe(true);
    expect(isJobBoardPublicPath("/blog/guia")).toBe(false);
    expect(isJobBoardPublicPath("/noticias/x")).toBe(false);
    expect(isJobBoardPublicPath("/redacao")).toBe(false);
  });

  it("keeps only editorial sitemaps when portal mode is on", () => {
    expect(sitemapCategoryAllowedWhenPortalEditorial("blog")).toBe(true);
    expect(sitemapCategoryAllowedWhenPortalEditorial("news")).toBe(true);
    expect(sitemapCategoryAllowedWhenPortalEditorial("static")).toBe(true);
    expect(sitemapCategoryAllowedWhenPortalEditorial("web-stories")).toBe(true);
    expect(sitemapCategoryAllowedWhenPortalEditorial("jobs")).toBe(false);
    expect(sitemapCategoryAllowedWhenPortalEditorial("companies")).toBe(false);
    expect(sitemapCategoryAllowedWhenPortalEditorial("cities")).toBe(false);
    expect(sitemapCategoryAllowedWhenPortalEditorial("categories")).toBe(false);
  });

  it("filters static paths for portal mode", () => {
    expect(staticPathAllowedWhenPortalEditorial("/sobre")).toBe(true);
    expect(staticPathAllowedWhenPortalEditorial("/vagas")).toBe(false);
    expect(staticPathAllowedWhenPortalEditorial("/publicar-vaga")).toBe(false);
  });

  it("switches public nav without inventing empty pages", () => {
    const editorial = getPublicNav(true);
    const hrefs = editorial.map((item) => item[1]);
    expect(hrefs).toEqual(
      expect.arrayContaining(["/", "/blog", "/noticias", "/sobre", "/redacao", "/seguranca-candidatos"])
    );
    expect(hrefs).toContain(editorialBlogThemeHref("curriculo"));
    expect(hrefs).toContain(editorialBlogThemeHref("entrevista"));
    expect(hrefs).toContain(editorialBlogThemeHref("primeiro-emprego"));
    expect(hrefs).toContain(editorialBlogThemeHref("mercado"));
    expect(hrefs).not.toContain("/vagas");
    expect(hrefs).not.toContain("/empresas");
    expect(hrefs).not.toContain("/publicar-vaga");
    const normal = getPublicNav(false);
    expect(normal.map((item) => item[1])).toContain("/vagas");
  });

  it("resolves only allowlisted blog themes", () => {
    expect(resolveEditorialBlogTheme("curriculo")).toBe("curriculo");
    expect(resolveEditorialBlogTheme("hack")).toBeNull();
    expect(resolveEditorialBlogTheme(null)).toBeNull();
  });

  it("does not cloak by user-agent — modes come from settings module only", () => {
    const portal = read("apps/web/src/lib/portal-modes.ts");
    const gate = read("apps/web/src/lib/job-board-gate.ts");
    const index = read("apps/web/src/pages/index.astro");
    expect(portal).not.toMatch(/user-agent|userAgent|bot|googlebot/i);
    expect(gate).not.toMatch(/user-agent|userAgent|googlebot/i);
    expect(index).toContain("getEditorialPortalMode");
    expect(index).not.toMatch(/user-agent|googlebot/i);
  });

  it("gates job pages with paused soft landing and omits JobPosting when paused", () => {
    const jobPage = read("apps/web/src/pages/vagas/[slug].astro");
    expect(jobPage).toContain("jobBoardPublicGate");
    expect(jobPage).toContain("JobBoardPaused");
    expect(jobPage).toContain("gate.paused ? null");
    expect(jobPage).toMatch(/gate\.paused \|\| !job/);
  });

  it("protects mode toggles with seo.manage RBAC", () => {
    expect(read("apps/web/src/pages/api/admin/editorial-portal-mode.ts")).toContain('can(auth, "seo.manage")');
    expect(read("apps/web/src/pages/api/admin/adsense-review-mode.ts")).toContain('can(auth, "seo.manage")');
    expect(read("apps/web/src/pages/api/admin/editorial-audit/safe-fix.ts")).toContain('can(auth, "content.manage")');
  });

  it("keeps worker imports independent from portal mode", () => {
    // Importações não consultam portal mode — publicação pública pausada, pipeline intacto.
    const workerSrc = read("apps/worker/src/index.ts");
    expect(workerSrc).not.toContain("getEditorialPortalMode");
    expect(workerSrc).not.toContain("editorial_portal_mode");
  });

  it("workers skip job alerts/social/indexing leaks when portal mode flag is on", () => {
    expect(read("apps/worker/src/alert-dispatch.ts")).toContain("editorial_portal_mode");
    expect(read("apps/worker/src/social-processor.ts")).toContain("editorial_portal_mode");
    expect(read("apps/worker/src/maintenance.ts")).toContain("portalMode");
  });

  it("rewrites job-board links in article pages when portal is on", () => {
    expect(read("apps/web/src/pages/blog/[slug].astro")).toContain("rewriteJobBoardLinksForPortal");
    expect(read("apps/web/src/pages/noticias/[slug].astro")).toContain("rewriteJobBoardLinksForPortal");
  });

  it("omits SearchAction to /busca in BaseLayout when portal mode is considered", () => {
    const layout = read("apps/web/src/layouts/BaseLayout.astro");
    expect(layout).toContain("getEditorialPortalMode");
    expect(layout).toContain("portal.enabled");
    expect(layout).toContain("potentialAction");
  });

  it("FACT_REVIEW quality guides remain hold in package data", () => {
    const pkg = read("scripts/data/adsense-quality-guides.mjs");
    expect(pkg).toContain("jovem-aprendiz-como-funciona");
    expect(pkg).toContain("estagio-x-jovem-aprendiz");
    expect(pkg).toContain("HOLD_REVIEW");
    expect(pkg).toContain("FACT_REVIEW");
  });
});
