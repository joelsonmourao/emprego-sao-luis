import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";

export const ADMIN_STORAGE_STATE = resolve("tmp/e2e-admin-storage.json");

export function hasAdminStorageState() {
  return existsSync(ADMIN_STORAGE_STATE);
}

/** Login fallback quando storageState não existe (ex.: credenciais ausentes no globalSetup). */
export async function loginAdmin(page: Page) {
  const email = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) throw new Error("E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD não configurados");

  await page.goto("/admin/login");
  await page.locator("#admin-login-form input[name='email'], input[name='email']").first().fill(email);
  await page.locator("#admin-login-form input[name='password'], input[name='password']").first().fill(password);
  await page.locator("#admin-login-form button[type='submit'], button[type='submit']").first().click();
  await page.waitForURL(
    (url) => url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login"),
    { timeout: 30_000 }
  );
}

export async function ensureAdminSession(page: Page) {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  if (page.url().includes("/admin/login")) {
    await loginAdmin(page);
  }
}
