import { expect, test } from "@playwright/test";

test("health endpoint reports healthy", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({ ok: true, service: "web" });
});

test("readiness fails closed without infrastructure", async ({ request }) => {
  const response = await request.get("/api/ready", { failOnStatusCode: false });
  expect(response.status()).toBe(503);
  await expect(response.json()).resolves.toMatchObject({ ok: false, status: "not_ready" });
});

for (const [path, text] of [["/", "Seu próximo trabalho pode estar mais perto do que você imagina."], ["/vagas", "Vagas de emprego"], ["/instagram", "Empregos São Luís"], ["/alertas", "Receba alertas"]] as const) {
  test(`${path} renders useful HTML`, async ({ request }) => { const response = await request.get(path); expect(response.ok()).toBe(true); expect(await response.text()).toContain(text); });
}

test("discovery endpoints are available", async ({ request }) => {
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
  expect((await request.get("/feed.xml")).ok()).toBe(true);
});

test("admin is protected", async ({ request }) => {
  const response = await request.get("/admin");
  expect(response.url()).toContain("/admin/login");
  expect(await response.text()).toContain("Painel administrativo");
});
