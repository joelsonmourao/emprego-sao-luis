import { chromium, type FullConfig } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const storagePath = resolve("tmp/e2e-admin-storage.json");

async function waitForReady(baseURL: string) {
  const deadline = Date.now() + 90_000;
  let lastError = "não iniciado";
  while (Date.now() < deadline) {
    try {
      const health = await fetch(`${baseURL}/api/health`);
      const ready = await fetch(`${baseURL}/api/ready`);
      if (health.ok && ready.ok) return;
      lastError = `health=${health.status} ready=${ready.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 1_000));
  }
  throw new Error(`Servidor E2E não ficou ready em ${baseURL}: ${lastError}`);
}

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? "http://127.0.0.1:4321";
  await waitForReady(baseURL);

  const email = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) {
    console.warn("[e2e globalSetup] Credenciais admin ausentes — storageState não gerado.");
    return;
  }

  mkdirSync(resolve("tmp"), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(`${baseURL}/admin/login`, { waitUntil: "domcontentloaded" });
    await page.locator("#admin-login-form input[name='email'], input[name='email']").first().fill(email);
    await page.locator("#admin-login-form input[name='password'], input[name='password']").first().fill(password);
    await page.locator("#admin-login-form button[type='submit'], button[type='submit']").first().click();
    await page.waitForURL(
      (url) => url.pathname.startsWith("/admin") && !url.pathname.startsWith("/admin/login"),
      { timeout: 30_000 }
    );
    await page.context().storageState({ path: storagePath });
    console.log(`[e2e globalSetup] storageState salvo em ${storagePath}`);
  } finally {
    await browser.close();
  }
}
