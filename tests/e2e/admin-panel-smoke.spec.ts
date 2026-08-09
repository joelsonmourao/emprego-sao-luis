import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_STORAGE_STATE, ensureAdminSession, hasAdminStorageState } from "./helpers/admin-auth";

const adminNavSource = readFileSync(resolve("apps/web/src/lib/admin-nav.ts"), "utf8");
const menuRoutes = [...new Set([...adminNavSource.matchAll(/href:\s*"(\/admin[^"]+)"/g)].map((match) => match[1]))];

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;

test.describe("painel administrativo — smoke autenticado", () => {
  test.skip(!adminEmail || !adminPassword, "E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD não configurados");

  if (hasAdminStorageState()) {
    test.use({ storageState: ADMIN_STORAGE_STATE });
  }

  test.beforeEach(async ({ page }) => {
    await ensureAdminSession(page);
  });

  test("login abre o painel", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  for (const route of menuRoutes) {
    test(`rota ${route} abre sem erro`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 45_000 });
      expect(response?.status(), `status inesperado em ${route}`).toBeLessThan(400);
      await expect(page.locator("main")).toBeVisible();
      expect(page.url()).not.toContain("/api/");
      expect(page.url()).not.toContain("/admin/login");
      expect(consoleErrors.join("\n")).not.toMatch(/hydration|uncaught/i);
    });
  }

  test("importação abre página real, não API", async ({ page }) => {
    await page.goto("/admin/vagas/importar");
    await expect(page.getByRole("heading", { name: "Importar vagas", exact: true })).toBeVisible();
    await expect(page.getByText("Selecionar arquivo")).toBeVisible();
    expect(page.url()).toContain("/admin/vagas/importar");
  });

  test("menu não contém links /api", async ({ page }) => {
    await page.goto("/admin");
    const apiLinks = page.locator('aside nav a[href^="/api/"]');
    await expect(apiLinks).toHaveCount(0);
  });
});

test("GET /api/admin/imports retorna 405 ou exige autenticação", async ({ request }) => {
  const response = await request.get("/api/admin/imports", { failOnStatusCode: false });
  expect([401, 405]).toContain(response.status());
  if (response.status() === 405) {
    expect(response.headers()["allow"]).toBe("POST");
  }
});

test("GET /admin/vagas/importar retorna 200", async ({ request }) => {
  const response = await request.get("/admin/vagas/importar", { failOnStatusCode: false });
  expect([200, 302, 303]).toContain(response.status());
});
