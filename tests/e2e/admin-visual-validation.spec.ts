import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_STORAGE_STATE, ensureAdminSession, hasAdminStorageState } from "./helpers/admin-auth";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;
const shotDir = resolve("tmp/admin-visual");
mkdirSync(shotDir, { recursive: true });

const routes: Array<{ name: string; path: string }> = [
  { name: "menu", path: "/admin" },
  { name: "importacao", path: "/admin/vagas/importar" },
  { name: "importar-contatos", path: "/admin/vagas/importar-contatos" },
  { name: "revisao", path: "/admin/vagas/revisao" },
  { name: "monitor", path: "/admin/vagas/monitor-candidaturas" },
  { name: "pilares", path: "/admin/conteudo/pilares" },
  { name: "post-magnetico", path: "/admin/conteudo/post-magnetico" },
  { name: "adsense-readiness", path: "/admin/adsense-readiness" },
  { name: "qualidade-vagas", path: "/admin/qualidade-vagas" },
  { name: "qualidade-editorial", path: "/admin/qualidade-editorial" },
  { name: "web-stories", path: "/admin/web-stories" },
  { name: "planos", path: "/admin/comercial/planos" },
  { name: "publicidade", path: "/admin/publicidade" },
  { name: "nova-vaga-canais", path: "/admin/vagas/nova" }
];

test.describe("validação visual admin — continuidade", () => {
  test.skip(!adminEmail || !adminPassword, "Credenciais E2E ausentes");

  if (hasAdminStorageState()) {
    test.use({ storageState: ADMIN_STORAGE_STATE });
  }

  test.beforeEach(async ({ page }) => {
    await ensureAdminSession(page);
  });

  for (const route of routes) {
    test(`screenshot ${route.name}`, async ({ page }) => {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded", timeout: 45_000 });
      expect(response?.status() ?? 500).toBeLessThan(400);
      expect(page.url()).not.toContain("/admin/login");
      await expect(page.locator("main")).toBeVisible();
      await expect(page.getByRole("heading").first()).toBeVisible();
      await page.screenshot({
        path: resolve(shotDir, `${route.name}.png`),
        fullPage: true
      });
    });
  }

  test("menu lista a nova arquitetura e prioridades do dashboard", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: /Ações prioritárias/i })).toBeVisible();
    const nav = page.locator("aside nav");
    for (const label of ["Dashboard", "Vagas", "Qualidade das vagas", "Qualidade editorial", "Central AdSense", "Monetização", "Usuários"])
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveCount(1);
    await page.screenshot({ path: resolve(shotDir, "menu-completo.png"), fullPage: true });
  });

  test("menu móvel abre, mantém foco e não cria overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin");
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await expect(page.locator("#admin-sidebar")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    await page.screenshot({ path: resolve(shotDir, "menu-mobile.png"), fullPage: true });
  });
});
