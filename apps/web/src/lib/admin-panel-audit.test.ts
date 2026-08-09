import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { ADMIN_NAV_GROUPS } from "./admin-nav";

const read = (relativePath: string) => readFileSync(resolve(relativePath), "utf8");

function collectAdminPages(dir: string, base = ""): string[] {
  const entries = readdirSync(dir);
  const pages: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const rel = `${base}/${entry}`;
    if (statSync(full).isDirectory()) {
      pages.push(...collectAdminPages(full, rel));
      continue;
    }
    if (entry.endsWith(".astro") && entry !== "[module].astro") {
      pages.push(rel.replace(/\\/g, "/").replace(/\.astro$/, "").replace(/\/index$/, ""));
    }
  }
  return pages;
}

function collectFiles(dir: string, extensions: string[]): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory()
      ? collectFiles(full, extensions)
      : extensions.some((extension) => entry.endsWith(extension))
        ? [full]
        : [];
  });
}

describe("auditoria do painel administrativo", () => {
  it("menu não aponta para /api", () => {
    const hrefs = ADMIN_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.href));
    expect(hrefs.every((href) => !href.startsWith("/api/"))).toBe(true);
    expect(hrefs).toContain("/admin/vagas/importar");
  });

  it("AdminLayout intercepta formulários com action /api/", () => {
    const layout = read("apps/web/src/layouts/AdminLayout.astro");
    expect(layout).toContain("ADMIN_FORM_BRIDGE_SCRIPT");
    expect(layout).toContain("admin-form-bridge");
  });

  it("importação usa página real e API retorna JSON", () => {
    const page = read("apps/web/src/pages/admin/vagas/importar.astro");
    const api = read("apps/web/src/pages/api/admin/imports/index.ts");
    expect(page).toContain("Importar vagas");
    expect(page).toContain('action="/api/admin/imports"');
    expect(page).toContain("data-admin-download");
    expect(page).not.toContain("Esta integração ainda não está configurada");
    expect(api).toContain("adminJsonRedirect");
    expect(api).toContain('adminMethodNotAllowed("POST")');
    expect(api).toContain("getImportStorageInfo");
    expect(api).toContain("putImportFile");
  });

  it("rota legada /admin/importacao redireciona", () => {
    expect(read("apps/web/src/pages/admin/importacao.astro")).toContain("/admin/vagas/importar");
  });

  it("dashboard e saúde não abrem /api diretamente", () => {
    const dashboard = read("apps/web/src/pages/admin/index.astro");
    const health = read("apps/web/src/pages/admin/saude.astro");
    expect(dashboard).not.toContain('href="/api/');
    expect(health).not.toContain('href="/api/');
    expect(health).toContain('loadEndpoint("/api/ready")');
  });

  it("APIs de importação expõem GET 405", () => {
    for (const file of [
      "apps/web/src/pages/api/admin/imports/index.ts",
      "apps/web/src/pages/api/admin/imports/[id]/configure.ts",
      "apps/web/src/pages/api/admin/imports/[id]/execute.ts",
      "apps/web/src/pages/api/admin/imports/[id]/undo.ts"
    ]) {
      expect(read(file)).toContain("adminMethodNotAllowed");
    }
  });

  it("todas as páginas do menu existem", () => {
    const missing = ADMIN_NAV_GROUPS.flatMap((g) => g.items)
      .map((item) => item.href.split(/[?#]/)[0]!.replace(/^\//, ""))
      .filter((href) => {
        const candidates = [
          resolve(`apps/web/src/pages/${href}.astro`),
          resolve(`apps/web/src/pages/${href}/index.astro`)
        ];
        return !candidates.some((file) => existsSync(file));
      });
    expect(missing).toEqual([]);
  });

  it("inventaria páginas administrativas auditáveis", () => {
    const pages = collectAdminPages(resolve("apps/web/src/pages/admin"));
    expect(pages.length).toBeGreaterThanOrEqual(35);
  });

  it("nenhum link administrativo navega diretamente para API", () => {
    const pages = collectFiles(resolve("apps/web/src/pages/admin"), [".astro"]);
    const offenders = pages.flatMap((file) => {
      const source = readFileSync(file, "utf8");
      return [...source.matchAll(/<a\b[^>]*href=(?:"[^"`]*|\{`[^`]*|\{"[^"}]*)(\/api\/admin\/)[^>]*>/g)]
        .filter((match) => !match[0].includes("data-admin-download"))
        .map(() => file);
    });
    expect(offenders).toEqual([]);
  });

  it("não usa atalhos incompatíveis com Zod 3", () => {
    const files = collectFiles(resolve("apps/web/src"), [".ts", ".tsx", ".astro"]);
    const offenders = files.filter((file) => /\bz\.(?:email|uuid)\s*\(/.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("middleware padroniza toda resposta de API administrativa", () => {
    const middleware = read("apps/web/src/middleware.ts");
    expect(middleware).toContain('path.startsWith("/api/admin")');
    expect(middleware).toContain("normalizeAdminApiResponse(response, requestId!)");
    expect(middleware).toContain('code: "UNHANDLED_ADMIN_API_ERROR"');
  });

  it("inventaria todos os endpoints administrativos sob autenticação central", () => {
    const apiFiles = collectFiles(resolve("apps/web/src/pages/api/admin"), [".ts"]);
    expect(apiFiles.length).toBeGreaterThanOrEqual(70);
    const middleware = read("apps/web/src/middleware.ts");
    expect(middleware).toContain('(path.startsWith("/api/admin") && path !== "/api/admin/login")');
    expect(middleware).toContain('adminJsonError("Não autenticado.", 401)');
  });
});
