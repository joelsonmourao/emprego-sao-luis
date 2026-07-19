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

  test("menu lista áreas novas", async ({ page }) => {
    await page.goto("/admin");
    const nav = page.locator("aside nav");
    await expect(nav.getByRole("link", { name: /Importar por links/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Revisão e aprovação/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Monitor de candidaturas/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Pilares e clusters/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Post Magnético/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Rota da Aprovação/i })).toBeVisible();
    await page.screenshot({ path: resolve(shotDir, "menu-completo.png"), fullPage: true });
  });
});
