import { expect, test } from "@playwright/test";

test("health endpoint reports healthy", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({ ok: true, service: "web" });
});
