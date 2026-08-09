import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { ADMIN_STORAGE_STATE, ensureAdminSession, hasAdminStorageState } from "./helpers/admin-auth";

const adminNavSource = readFileSync(resolve("apps/web/src/lib/admin-nav.ts"), "utf8");
const menuRoutes = [...new Set([...adminNavSource.matchAll(/href:\s*"(\/admin[^"]+)"/g)].map((match) => match[1]))];

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;

function collectAstroRoutes(dir: string, prefix = ""): string[] {
  const routes: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      routes.push(...collectAstroRoutes(full, `${prefix}/${entry}`));
      continue;
    }
    if (!entry.endsWith(".astro")) continue;
    const name = entry.replace(/\.astro$/, "");
    if (name === "index") routes.push(prefix || "/");
    else if (!name.startsWith("[")) routes.push(`${prefix}/${name}`);
  }
  return routes;
}

test.describe("auditoria completa do painel", () => {
  test.skip(!adminEmail || !adminPassword, "E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD não configurados");
  test.describe.configure({ mode: "serial" });

  if (hasAdminStorageState()) {
    test.use({ storageState: ADMIN_STORAGE_STATE });
  }

  test.beforeEach(async ({ page }) => {
    await ensureAdminSession(page);
  });

  for (const route of menuRoutes) {
    test(`admin ${route}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const failedRequests: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("response", (response) => {
        const url = response.url();
        if (url.includes("/api/") && response.status() >= 400 && response.request().method() !== "GET") {
          failedRequests.push(`${response.status()} ${url}`);
        }
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45_000 });
      expect(response?.status(), `HTTP em ${route}`).toBe(200);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByRole("heading").first()).toBeVisible();
      await page.waitForLoadState("load");
      expect(page.url(), `redirecionou para API em ${route}`).not.toMatch(/\/api\//);
      expect(page.url()).not.toContain("/admin/login");
      expect(consoleErrors, `erros de console em ${route}`).toEqual([]);
      expect(failedRequests, `requisições de mutação falharam em ${route}`).toEqual([]);

      await expect(page.locator('a[href^="/api/"]:not([data-admin-download])')).toHaveCount(0);
      const apiForms = page.locator('form[action^="/api/"]');
      const formCount = await apiForms.evaluateAll((nodes) => nodes.length);
      for (let index = 0; index < formCount; index += 1) {
        await expect(apiForms.nth(index).locator('button, input[type="submit"]').first()).toBeVisible();
      }
    });
  }

  test("nova vaga possui selects e cadastro rápido", async ({ page }) => {
    await page.goto("/admin/vagas/nova");
    await expect(page.getByRole("heading", { name: "Nova vaga" })).toBeVisible();
    await expect(page.locator("#companyId")).toBeVisible();
    await expect(page.locator("#stateId")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cadastrar nova empresa" })).toBeVisible();
    await expect(page.locator("#slug")).toBeVisible();
    const slugValue = await page.locator("#slug").inputValue();
    expect(slugValue).not.toBe("1");
  });

  test("importação não bloqueia por S3 ausente", async ({ page }) => {
    await page.goto("/admin/vagas/importar");
    await expect(page.getByRole("heading", { name: "Importar vagas", exact: true })).toBeVisible();
    await expect(page.getByText("Esta integração ainda não está configurada")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Analisar arquivo" })).toBeEnabled();
  });
});

test.describe("auditoria portal público", () => {
  const smokePublic = ["/", "/vagas", "/empresas", "/noticias", "/contato", "/busca"];

  for (const route of smokePublic) {
    test(`público ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status() ?? 0).toBeLessThan(400);
      expect(page.url()).not.toContain("/api/");
    });
  }
});

test("APIs críticas rejeitam GET indevido", async ({ request }) => {
  for (const path of ["/api/admin/imports", "/api/admin/jobs"]) {
    const response = await request.get(path, { failOnStatusCode: false });
    expect([401, 405]).toContain(response.status());
  }
});
