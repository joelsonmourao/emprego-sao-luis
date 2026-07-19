import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { ADMIN_STORAGE_STATE, ensureAdminSession, hasAdminStorageState } from "./helpers/admin-auth";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;
const shotDir = resolve("tmp/admin-visual");
mkdirSync(shotDir, { recursive: true });

test.describe("CRUD autenticado — persistência admin", () => {
  test.skip(!adminEmail || !adminPassword, "Credenciais E2E ausentes");
  if (hasAdminStorageState()) test.use({ storageState: ADMIN_STORAGE_STATE });
  test.beforeEach(async ({ page }) => {
    await ensureAdminSession(page);
  });

  test("pilares: criar, recarregar, editar estado e validar erro", async ({ page }) => {
    const stamp = Date.now();
    const name = `E2E Pilar ${stamp}`;
    const slug = `e2e-pilar-${stamp}`;
    await page.goto("/admin/conteudo/pilares");
    expect(page.url()).not.toContain("/admin/login");

    const pillarForm = page.locator('form[action="/api/admin/content-pillars"]').filter({ has: page.locator('input[name="action"][value="CREATE_PILLAR"]') });
    await pillarForm.locator('input[name="name"]').fill(name);
    await pillarForm.locator('input[name="slug"]').fill(slug);
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/admin/conteudo/pilares" && url.searchParams.get("saved") === "1"),
      pillarForm.getByRole("button", { name: /Criar pilar/i }).click()
    ]);
    await expect(page.getByText(/Alterações salvas/i)).toBeVisible();
    await expect(page.getByRole("heading", { name })).toBeVisible();

    await page.goto("/admin/conteudo/pilares");
    const article = page.locator("article").filter({ has: page.getByRole("heading", { name }) });
    await expect(article.getByText(/ativo/i)).toBeVisible();
    await Promise.all([
      page.waitForURL((url) => url.searchParams.get("saved") === "1"),
      article.getByRole("button", { name: /Desativar/i }).click()
    ]);
    await expect(page.getByText(/Alterações salvas/i)).toBeVisible();
    await page.goto("/admin/conteudo/pilares");
    await expect(page.locator("article").filter({ has: page.getByRole("heading", { name }) }).getByText(/inativo/i)).toBeVisible();

    const invalid = page.locator('form[action="/api/admin/content-pillars"]').filter({ has: page.locator('input[name="action"][value="CREATE_PILLAR"]') });
    await invalid.locator('input[name="name"]').fill("");
    await invalid.locator('input[name="slug"]').fill("");
    await invalid.getByRole("button", { name: /Criar pilar/i }).click();
    const nameValid = await invalid.locator('input[name="name"]').evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(nameValid).toBe(false);
    expect(page.url()).not.toMatch(/saved=1/);

    await page.screenshot({ path: resolve(shotDir, "crud-pilares.png"), fullPage: true });
  });

  test("Post Magnético: abrir lista autenticada e novo formulário", async ({ page }) => {
    await page.goto("/admin/conteudo/post-magnetico");
    expect(page.url()).not.toContain("/admin/login");
    await expect(page.getByRole("heading", { name: /Post Magnético/i })).toBeVisible();
    await page.goto("/admin/conteudo/novo?template=POST_MAGNETICO");
    await expect(page.locator('select[name="editorialTemplate"]')).toHaveValue("POST_MAGNETICO");
    await page.screenshot({ path: resolve(shotDir, "crud-post-magnetico.png"), fullPage: true });
  });

  test("importação XLSX/CSV e contatos autenticados", async ({ page }) => {
    await page.goto("/admin/vagas/importar");
    expect(page.url()).not.toContain("/admin/login");
    await expect(page.getByRole("link", { name: /Baixar modelo Excel/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Baixar modelo CSV/i })).toBeVisible();
    await page.goto("/admin/vagas/importar-contatos");
    await expect(page.getByRole("heading", { name: /Importar vagas por links/i })).toBeVisible();
    await page.screenshot({ path: resolve(shotDir, "crud-import.png"), fullPage: true });
  });

  test("Rota da Aprovação e Web Stories autenticados", async ({ page }) => {
    await page.goto("/admin/adsense-readiness");
    expect(page.url()).not.toContain("/admin/login");
    await expect(page.getByText(/não garante aprovação pelo Google AdSense/i).first()).toBeVisible();
    await page.goto("/admin/web-stories");
    await expect(page.locator("main")).toBeVisible();
    await page.screenshot({ path: resolve(shotDir, "crud-adsense-stories.png"), fullPage: true });
  });

  test("monetização B2B autenticada", async ({ page }) => {
    await page.goto("/admin/comercial/planos");
    expect(page.url()).not.toContain("/admin/login");
    await expect(page.locator("main")).toBeVisible();
    await page.goto("/admin/vagas-patrocinadas");
    await expect(page.getByRole("heading", { name: /patrocinad|destacad/i })).toBeVisible();
    await page.goto("/admin/publicidade");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("imagens públicas — marca", () => {
  for (const width of [375, 768, 1024, 1366, 1920]) {
    test(`home ${width}px sem overflow e com ativos de marca`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto("/", { waitUntil: "domcontentloaded" });
      expect(response?.ok()).toBeTruthy();
      const icon = page.locator('img[src="/brand/icon-instagram.webp"]');
      await expect(icon).toHaveCount(1);
      const box = await icon.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(width < 640 ? 120 : 140);
      const dims = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(dims.scrollWidth).toBeLessThanOrEqual(dims.clientWidth + 1);
      if (width === 375 || width === 1366) {
        await page.screenshot({ path: resolve(shotDir, `home-brand-${width}.png`), fullPage: true });
      }
    });
  }

  test("favicon e assets de marca respondem 200", async ({ request }) => {
    for (const path of [
      "/brand/icon.webp",
      "/brand/icon-instagram.webp",
      "/brand/logo-horizontal.webp",
      "/favicon-32x32.png",
      "/favicon-16x16.png",
      "/favicon-48x48.png",
      "/apple-touch-icon.png",
      "/icon-192.png",
      "/icon-512.png"
    ]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });
});
