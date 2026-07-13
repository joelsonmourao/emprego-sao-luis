import { expect, test } from "@playwright/test";

test("health endpoint reports healthy", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(response.headers()["x-es-app"]).toBe("astro");
  await expect(response.json()).resolves.toMatchObject({ ok: true, service: "web" });
});

test("readiness fails closed without infrastructure", async ({ request }) => {
  const response = await request.get("/api/ready", { failOnStatusCode: false });
  expect(response.status()).toBe(503);
  expect(response.headers()["content-type"]).toContain("application/json");
  expect(response.headers()["x-es-app"]).toBe("astro");
  await expect(response.json()).resolves.toMatchObject({ ok: false, status: "not_ready" });
});

for (const [path, text] of [["/", "Seu próximo trabalho pode estar mais perto do que você imagina."], ["/vagas", "Vagas de emprego"], ["/instagram", "Empregos São Luís"], ["/alertas", "Receba vagas compatíveis com você"]] as const) {
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

test("admin login accepts the centralized nine-character policy", async ({ request }) => {
  const response = await request.get("/admin/login");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('minlength="9"');
  expect(html).toContain("A senha deve ter pelo menos 9 caracteres.");
});

test("publish job renders a safe setup state without commercial configuration", async ({ request }) => {
  const response = await request.get("/publicar-vaga", { failOnStatusCode: false });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Publicação de vagas em configuração");
  expect(html).toContain("Os planos para publicação ainda estão sendo preparados.");
  expect(html).not.toContain(">Falar com o comercial</a>");
});

test("empresa login returns 200 and is distinct from admin", async ({ request }) => {
  const response = await request.get("/empresa/login");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("Área da empresa");
  expect(html).toContain("Não é o painel administrativo");
  expect(html).not.toContain("Painel administrativo");
});

test("public navigation links auth areas correctly", async ({ request }) => {
  const home = await request.get("/");
  const html = await home.text();
  expect(html).toContain('href="/empresa/login"');
  expect(html).toContain("Área da empresa");
  expect(html).toContain('href="/admin/login"');
  expect(html).toContain("Administração");
});

test("admin login and publish job remain readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/admin/login");
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByText("A senha deve ter pelo menos 9 caracteres.")).toBeVisible();
  await page.goto("/publicar-vaga");
  await expect(page.getByRole("heading", { name: "Publicação de vagas em configuração" })).toBeVisible();
});

test("custom 404 belongs to the Astro portal", async ({ request }) => {
  const response = await request.get("/rota-inexistente-e2e", { failOnStatusCode: false });
  expect(response.status()).toBe(404);
  expect(response.headers()["x-es-app"]).toBe("astro");
  expect(await response.text()).toContain("Esta página não foi encontrada.");
});
