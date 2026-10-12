import { expect, test } from "@playwright/test";

test("ferramenta CSV: funciona sem conta, nao transmite dados e respeita campos", async ({ page }) => {
  const unexpectedApi: string[] = [];
  page.on("request", (request) => {
    if (/\/api\/(contato|candidatura|admin|empresa)/.test(new URL(request.url()).pathname)) {
      unexpectedApi.push(request.url());
    }
  });
  const response = await page.goto("/ferramentas/controle-candidaturas", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: /controle suas candidaturas/i })).toBeVisible();
  await page.locator('[name="cargo"]').fill("Assistente Administrativo");
  await page.locator('[name="empresa"]').fill("Empresa de teste");
  await page.locator('[name="data"]').fill("2026-10-12");
  await page.locator('[name="proximo"]').fill("Aguardar resposta do canal oficial");
  await page.getByRole("button", { name: "Adicionar candidatura" }).click();
  await expect(page.locator("#controle-contagem")).toContainText("1 candidatura");
  await expect(page.locator("#controle-linhas")).toContainText("Assistente Administrativo");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("controle-candidaturas.csv");
  const dialogPromise = page.waitForEvent("dialog");
  await page.getByRole("button", { name: "Limpar a lista" }).click();
  const dialog = await dialogPromise;
  await dialog.accept();
  await expect(page.locator("#controle-contagem")).toContainText("0 candidaturas");
  expect(unexpectedApi).toEqual([]);
});

test("guia SINE possui fonte oficial, conteudo proprio e indexacao clara", async ({ page }) => {
  const response = await page.goto("/guias/emprego-sine-maranhao", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("main#conteudo h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /como preparar um perfil/i })).toBeVisible();
  await expect(page.locator('a[href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine"]').first()).toBeVisible();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/\/guias\/emprego-sine-maranhao$/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /SINE no Maranh/i);
});

test("metadados de imagem para redes sociais usam URLs absolutas", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    const image = await page.locator(selector).first().getAttribute("content");
    if (image) expect(image).toMatch(/^https?:\/\//);
  }
});

for (const width of [360, 768, 1440]) {
  test(`ferramenta e guia sem overflow horizontal no viewport ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/ferramentas/controle-candidaturas", "/guias/emprego-sine-maranhao"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(widths.scroll, route).toBeLessThanOrEqual(widths.client + 1);
    }
  });
}
