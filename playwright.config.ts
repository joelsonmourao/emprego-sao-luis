import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const adminStorage = resolve("tmp/e2e-admin-storage.json");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Sem retries: falhas reais não viram "flaky". Correção na raiz, não mascaramento.
  retries: 0,
  workers: process.env.E2E_WORKERS ? Number(process.env.E2E_WORKERS) : 3,
  timeout: 60_000,
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
    ...(existsSync(adminStorage) ? {} : {})
  },
  webServer: {
    command: "npm run dev --workspace=@es/web -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321/api/health",
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
