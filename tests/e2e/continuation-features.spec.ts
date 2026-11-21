import { expect, test } from "@playwright/test";
import { createHash, randomUUID } from "node:crypto";
import postgres from "postgres";
import { ADMIN_STORAGE_STATE, ensureAdminSession, hasAdminStorageState, loginAdmin } from "./helpers/admin-auth";

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_INITIAL_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_INITIAL_PASSWORD;
const allowMutations = process.env.E2E_ALLOW_MUTATIONS === "true";
const databaseUrl = process.env.E2E_DATABASE_URL ?? process.env.DATABASE_URL;

async function login(page: import("@playwright/test").Page) {
  if (hasAdminStorageState()) {
    // storageState aplicado no describe; só garante sessão
    await ensureAdminSession(page);
    return;
  }
  await loginAdmin(page);
}

test.describe("continuação — rotas públicas críticas", () => {
  test("hubs vazios e institucionais sem placeholders públicos", async ({ request }) => {
    // Hubs podem receber conteúdo publicado por outros testes em paralelo (CRUD).
    // Exige noindex apenas quando o empty state correspondente estiver visível.
    for (const [path, emptyMarker] of [
      ["/blog", /Nenhum guia publicado/i],
      ["/noticias", /Nenhuma notícia publicada|Nenhum conteúdo publicado|permanecerá fora do índice/i],
      ["/empresas", /Nenhuma empresa pública/i]
    ] as const) {
      const response = await request.get(path);
      expect(response.ok(), path).toBe(true);
      const html = await response.text();
      expect(html, path).not.toMatch(/\[configur[aá]vel no painel administrativo\]/i);
      if (emptyMarker.test(html)) expect(html, path).toMatch(/noindex/i);
    }
    for (const path of ["/privacidade", "/termos", "/cookies", "/contato", "/lgpd", "/politica-editorial", "/politica-fontes", "/politica-correcoes", "/seguranca-candidatos", "/publicar-vaga"]) {
      const response = await request.get(path);
      expect(response.ok(), path).toBe(true);
      const html = await response.text();
      expect(html, path).not.toMatch(/\[configur[aá]vel no painel administrativo\]/i);
      expect(html, path).toMatch(/<h1[\s>]/i);
    }
  });

  test("sitemaps index e filhos respondem XML válido", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    const robotsBody = await robots.text();
    const stagingLike = /Disallow:\s*\/\s*$/m.test(robotsBody);

    if (stagingLike) {
      // Homologação/E2E: bloqueio total sem declarar Sitemap ao Search Console.
      expect(robotsBody).toMatch(/Disallow:\s*\//i);
      expect(robotsBody).not.toMatch(/Sitemap:/i);
    } else {
      expect(robotsBody).toContain("Sitemap:");
    }

    const index = await request.get("/sitemap.xml");
    expect(index.ok()).toBe(true);
    const indexBody = await index.text();
    expect(indexBody).toMatch(/<(sitemapindex|urlset)[\s>]/);
    const children = [...indexBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]!);
    expect(children.length).toBeGreaterThan(0);
    for (const child of children) {
      const url = new URL(child);
      const response = await request.get(url.pathname + url.search);
      expect(response.status(), child).toBe(200);
      const body = await response.text();
      expect(body, child).toMatch(/<(urlset|sitemapindex)[\s>]/);
    }
  });

  test("rota corrompida /vagas/s não fica indexável como vaga válida", async ({ request }) => {
    const response = await request.get("/vagas/s", { maxRedirects: 0 });
    expect([301, 302, 303, 307, 308, 404]).toContain(response.status());
    if ([301, 302, 303, 307, 308].includes(response.status())) {
      const location = response.headers()["location"] ?? "";
      expect(location).toMatch(/indisponivel|vagas/i);
    }
  });

  test("AdSense permanece desativado no HTML público", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).not.toMatch(/pagead\/js\/adsbygoogle\.js/i);
    expect(html).not.toMatch(/data-ad-client=["']ca-pub-/i);
  });
});

test.describe("continuação — painel e candidatura multicanal", () => {
  test.skip(!allowMutations || !adminEmail || !adminPassword || !databaseUrl, "Requer E2E_ALLOW_MUTATIONS e banco isolado");
  if (hasAdminStorageState()) {
    test.use({ storageState: ADMIN_STORAGE_STATE });
  }

  test("Rota da Aprovação mostra disclaimer e etapas", async ({ page }) => {
    await login(page);
    await page.goto("/admin/adsense-readiness");
    await expect(page.getByRole("heading", { name: /Rota da Aprovação/i })).toBeVisible();
    await expect(page.getByText(/não garante aprovação pelo Google AdSense/i).first()).toBeVisible();
    await expect(page.getByText(/Etapa 0/i).first()).toBeVisible();
    await expect(page.getByText(/Etapa 5/i).first()).toBeVisible();
  });

  test("cria vagas com combinações de canais e valida UX pública", async ({ page }) => {
    const sql = postgres(databaseUrl!, { max: 1, prepare: false });
    try {
      const [company] = await sql<{ id: string }[]>`insert into es_companies (name, slug, active) values (${"E2E Empresa " + randomUUID().slice(0, 8)}, ${"e2e-empresa-" + randomUUID().slice(0, 8)}, true) returning id`;
      const [state] = await sql<{ id: string }[]>`select id from es_states where code = 'MA' limit 1`;
      const [city] = await sql<{ id: string }[]>`select id from es_cities where state_id = ${state!.id} limit 1`;
      expect(company && state && city).toBeTruthy();

      const cases = [
        { slug: `e2e-url-${randomUUID().slice(0, 8)}`, url: "https://example.com/vaga", email: null, whatsapp: null },
        { slug: `e2e-wa-${randomUUID().slice(0, 8)}`, url: null, email: null, whatsapp: "5598988881234" },
        { slug: `e2e-mail-${randomUUID().slice(0, 8)}`, url: null, email: "rh@empresa-e2e.com", whatsapp: null },
        { slug: `e2e-all-${randomUUID().slice(0, 8)}`, url: "https://example.com/vaga", email: "rh@empresa-e2e.com", whatsapp: "5598988881234" }
      ] as const;

      for (const item of cases) {
        const code = `ES-${String(Math.floor(Math.random() * 900000) + 100000)}`;
        const hash = createHash("sha256").update(item.slug).digest("hex");
        await sql`
          insert into es_jobs (
            public_code, slug, original_title, normalized_title, company_id, city_id, state_id,
            employment_type, workplace_type, summary, description, description_html,
            application_url, application_email, application_whatsapp, application_whatsapp_valid, application_email_valid,
            source_name, origin_type, duplicate_hash, verification_status, publication_status,
            published_at, expires_at, application_type
          ) values (
            ${code}, ${item.slug}, ${"Analista E2E"}, ${"Analista E2E"}, ${company!.id}, ${city!.id}, ${state!.id},
            ${"CLT"}, ${"presencial"},
            ${"Resumo suficiente para a vaga E2E de candidatura."},
            ${"Descrição detalhada com mais de cento e vinte caracteres para publicação da vaga E2E no portal Empregos São Luís."},
            ${"<p>Descrição detalhada com mais de cento e vinte caracteres para publicação da vaga E2E no portal Empregos São Luís.</p>"},
            ${item.url}, ${item.email}, ${item.whatsapp}, ${Boolean(item.whatsapp)}, ${Boolean(item.email)},
            ${"Site oficial"}, ${"MANUAL"}, ${hash}, ${"SOURCE_CONFIRMED"}, ${"PUBLISHED"},
            now(), now() + interval '7 days', ${item.url && item.email && item.whatsapp ? "MULTIPLE" : item.url ? "URL" : item.whatsapp ? "WHATSAPP" : "EMAIL"}
          )
        `;

        await page.goto(`/vagas/${item.slug}`);
        await expect(page.locator("h1", { hasText: "Analista E2E" })).toBeVisible();
        const summaryBlock = page.locator('[data-application-block="summary"]');
        const footerBlock = page.locator('[data-application-block="footer"]');
        await expect(summaryBlock).toBeVisible();
        await expect(footerBlock).toBeVisible();

        const body = await page.content();
        const summaryIdx = body.indexOf('data-application-block="summary"');
        const adIdx = body.indexOf('data-ad-slot') >= 0 ? body.indexOf("adsbygoogle") : -1;
        if (adIdx >= 0) expect(summaryIdx).toBeLessThan(adIdx);

        if (item.url) await expect(summaryBlock.getByRole("link", { name: /Candidatar-se no site/i })).toBeVisible();
        if (item.whatsapp) await expect(summaryBlock.getByRole("link", { name: /WhatsApp/i })).toBeVisible();
        if (item.email) {
          await expect(summaryBlock.getByRole("button", { name: /Ver e-mail de candidatura/i })).toBeVisible();
          await expect(summaryBlock.getByText("rh@empresa-e2e.com")).toHaveCount(0);
          await summaryBlock.getByRole("button", { name: /Ver e-mail de candidatura/i }).click();
          await expect(summaryBlock.getByText("rh@empresa-e2e.com")).toBeVisible();
          await expect(summaryBlock.getByRole("button", { name: /Copiar e-mail/i })).toBeVisible();
          await expect(summaryBlock.getByRole("link", { name: /Abrir aplicativo de e-mail/i })).toBeVisible();
        }
        expect(body).not.toMatch(/pagead\/js\/adsbygoogle\.js/i);
      }
    } finally {
      await sql.end({ timeout: 5 });
    }
  });

  test("Web Stories e classificação aparecem no painel", async ({ page }) => {
    await login(page);
    await page.goto("/admin/web-stories");
    await expect(page.getByRole("heading", { name: /Web Stories/i })).toBeVisible();
    await page.goto("/admin/classificacao");
    await expect(page.getByRole("heading", { name: /Regras de classificação/i })).toBeVisible();
    await page.goto("/admin/conteudo/novo");
    await expect(page.locator('select[name="editorialTemplate"]')).toContainText("Post Magnético");
  });
});
