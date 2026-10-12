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
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByRole("button", { name: "Limpar a lista" }).click();
  await expect(page.locator("#controle-contagem")).toContainText("0 candidaturas");
  expect(unexpectedApi).toEqual([]);
});

test("calculadora de deslocamento calcula em reais sem inventar tarifa", async ({ page }) => {
  const response = await page.goto("/ferramentas/custo-deslocamento", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await page.locator("#custo-trecho").fill("2.5");
  await page.locator("#trechos-dia").fill("2");
  await page.locator("#dias-mes").fill("22");
  await page.locator("#gastos-extras").fill("10");
  await page.locator("#salario-comparar").fill("2000");
  await page.getByRole("button", { name: /calcular meu deslocamento/i }).click();
  await expect(page.locator("#custo-transporte")).toContainText("110,00");
  await expect(page.locator("#custo-total")).toContainText("120,00");
  await expect(page.locator("#custo-percentual")).toContainText("6,0%");
  await expect(page.locator("#resultado-deslocamento")).toBeVisible();
});

test("guia SINE possui fonte oficial, conteudo proprio e indexacao clara", async ({ page }) => {
  const response = await page.goto("/guias/emprego-sine-maranhao", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("main#conteudo h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /como preparar um perfil/i })).toBeVisible();
  await expect(page.locator('a[href="https://www.gov.br/pt-br/servicos/buscar-emprego-no-sistema-nacional-de-emprego-sine"]').first()).toBeVisible();
  const canonicalLink = page.locator('link[rel="canonical"]');
  if (await canonicalLink.count()) {
    expect((await canonicalLink.getAttribute("href")) || "").toContain("/guias/emprego-sine-maranhao");
  } else {
    // O ambiente de CI/homologação desativa canonical e schema para evitar indexação.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
  }
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
    for (const route of ["/ferramentas/controle-candidaturas", "/guias/emprego-sine-maranhao", "/ferramentas/custo-deslocamento"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(widths.scroll, route).toBeLessThanOrEqual(widths.client + 1);
    }
  });
}
