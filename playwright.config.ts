import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  use: { baseURL: "http://127.0.0.1:4321", trace: "on-first-retry" },
  webServer: {
    command: "npm run dev --workspace=@es/web -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321/api/health",
    reuseExistingServer: true
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
