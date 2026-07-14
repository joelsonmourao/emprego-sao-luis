import { expect, test } from "@playwright/test";

test("grafo SEO central e páginas de erro sem canonical/schema", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  const graph = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(graph["@context"]).toBe("https://schema.org");
  expect(graph["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual(
    expect.arrayContaining(["Organization", "WebSite", "WebPage"])
  );
  expect(JSON.stringify(graph)).toContain("SearchAction");

  for (const route of ["/rota-seo-inexistente", "/vagas/indisponivel/vaga-removida"]) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect([404, 410]).toContain(response?.status());
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }

  const search = await request.get("/busca?q=analista");
  expect(await search.text()).toContain('content="noindex,follow"');
});

test("cache público, privado e assets de descoberta", async ({ request }) => {
  const home = await request.get("/");
  expect(home.headers()["cache-control"]).toContain("s-maxage=60");
  expect(home.headers()["cache-control"]).toContain("stale-while-revalidate=300");

  const login = await request.get("/admin/login");
  expect(login.headers()["cache-control"]).toContain("private, no-store");

  for (const route of ["/robots.txt", "/sitemap.xml", "/sitemap-news.xml", "/feed.xml"]) {
    expect((await request.get(route)).ok(), route).toBe(true);
  }
});

for (const width of [360, 768, 1440, 1920]) {
  test(`portal sem overflow horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/vagas", "/noticias", "/empresas"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      expect(dimensions.scrollWidth, route).toBeLessThanOrEqual(dimensions.clientWidth + 1);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
}
