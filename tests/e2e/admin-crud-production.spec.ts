import { expect, test, type APIResponse, type Page } from "@playwright/test";
import sharp from "sharp";
import * as XLSX from "xlsx";

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const allowMutations = process.env.E2E_ALLOW_MUTATIONS === "true";
const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:4321";
const origin = new URL(baseUrl).origin;

type Envelope<T = Record<string, unknown>> = {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
  redirect?: string;
  requestId?: string;
};

async function envelope<T = Record<string, unknown>>(response: APIResponse): Promise<Envelope<T>> {
  const payload = (await response.json().catch(() => null)) as Envelope<T> | null;
  expect(response.status(), JSON.stringify(payload)).toBeLessThan(400);
  expect(payload?.ok, JSON.stringify(payload)).toBe(true);
  return payload!;
}

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill(adminEmail!);
  await page.locator('input[name="password"]').fill(adminPassword!);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL(/\/admin(?:\?|$)/, { timeout: 20_000 });
}

test.describe.serial("CRUD administrativo no build de produção", () => {
  test.skip(
    !allowMutations || !adminEmail || !adminPassword,
    "Defina E2E_ALLOW_MUTATIONS=true, E2E_ADMIN_EMAIL e E2E_ADMIN_PASSWORD em um ambiente isolado."
  );

  test("login, cadastros, publicação, mídia, importação e arquivamento", async ({ page }) => {
    test.setTimeout(180_000);
    const suffix = Date.now().toString(36);
    const title = `Analista E2E ${suffix}`;
    const articleTitle = `Notícia E2E ${suffix}`;
    const unexpected: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") unexpected.push(`console: ${message.text()}`);
    });
    page.on("response", (response) => {
      if (response.status() >= 500) unexpected.push(`${response.status()} ${response.url()}`);
    });

    await test.step("login", async () => login(page));

    await page.goto("/admin/vagas/nova");
    const stateId = await page.locator('#stateId option[data-code="MA"]').getAttribute("value");
    expect(stateId, "O seed deve cadastrar o Maranhão").toBeTruthy();

    const cityPayload = await envelope<{ id: string; name: string; stateId: string }>(
      await page.request.post("/api/admin/locations/cities/quick", {
        headers: { origin },
        data: { name: `Cidade E2E ${suffix}`, stateId }
      })
    );
    const city = cityPayload.data!;

    const categoryPayload = await envelope<{ id: string; name: string }>(
      await page.request.post("/api/admin/categories/quick", {
        headers: { origin },
        data: { name: `Categoria E2E ${suffix}` }
      })
    );
    const category = categoryPayload.data!;

    const companyPayload = await envelope<{ id: string; name: string }>(
      await page.request.post("/api/admin/companies/quick", {
        headers: { origin },
        data: {
          name: `Empresa Interna E2E ${suffix}`,
          publicName: `Empresa E2E ${suffix}`,
          websiteUrl: "https://example.com",
          cityId: city.id,
          stateId,
          verified: false
        }
      })
    );
    const company = companyPayload.data!;

    const authorPayload = await envelope<{ author: { id: string; name: string; slug: string } }>(
      await page.request.post("/api/admin/authors", {
        headers: { origin },
        form: { name: `Autor E2E ${suffix}`, slug: `autor-e2e-${suffix}`, bio: "Autor criado pelo teste protegido.", returnTo: "json" }
      })
    );
    const author = authorPayload.data!.author;
    await envelope(
      await page.request.post(`/api/admin/authors/${author.id}`, {
        headers: { origin },
        form: { action: "UPDATE", name: `${author.name} Editado`, slug: author.slug, bio: "Biografia atualizada pelo fluxo E2E." }
      })
    );

    const image = await sharp({
      create: { width: 24, height: 24, channels: 4, background: { r: 185, g: 28, b: 28, alpha: 1 } }
    }).png().toBuffer();
    const mediaPayload = await envelope<{ asset: { id: string; url: string } }>(
      await page.request.post("/api/admin/media", {
        headers: { origin },
        multipart: {
          altText: "Imagem de teste do painel",
          file: { name: `e2e-${suffix}.png`, mimeType: "image/png", buffer: image }
        }
      })
    );
    const media = mediaPayload.data!.asset;
    await envelope(
      await page.request.post(`/api/admin/media/${media.id}`, {
        headers: { origin },
        form: { action: "UPDATE_ALT", altText: "Imagem E2E com ALT atualizado" }
      })
    );

    const expiresAt = new Date(Date.now() + 30 * 86_400_000).toISOString();
    const jobPayload = await envelope(
      await page.request.post("/api/admin/jobs", {
        headers: { origin },
        form: {
          originalTitle: title.toUpperCase(),
          normalizedTitle: title,
          slug: `analista-e2e-${suffix}`,
          companyId: company.id,
          categoryId: category.id,
          cityId: city.id,
          stateId: stateId!,
          neighborhood: "Centro",
          employmentType: "CLT",
          workplaceType: "hibrido",
          summary: "Resumo completo da vaga criada pelo teste E2E do painel administrativo.",
          description: "Descrição completa da oportunidade criada pelo teste E2E, com atividades, requisitos, benefícios e instruções de candidatura.",
          activities: "Atender usuários\nDocumentar chamados",
          requirements: "Boa comunicação\nOrganização",
          benefits: "Vale-transporte\nPlano de saúde",
          additionalInfo: "Cadastro temporário e protegido.",
          schedule: "Segunda a sexta",
          applicationUrl: "https://example.com/candidatura",
          sourceName: "Teste E2E",
          sourceUrl: "https://example.com/vaga",
          sourceEvidence: "Fluxo automatizado protegido",
          expiresAt,
          publicationStatus: "DRAFT",
          seoTitle: title,
          metaDescription: "Vaga temporária criada para validar o painel administrativo em produção."
        }
      })
    );
    const jobId = new URL(jobPayload.redirect!, baseUrl).searchParams.get("created");
    expect(jobId).toBeTruthy();

    for (const status of ["PENDING_REVIEW", "SCHEDULED", "PUBLISHED"] as const) {
      await page.goto(`/admin/vagas/${jobId}/editar`);
      await page.locator('select[name="publicationStatus"]').selectOption(status);
      if (status === "SCHEDULED") {
        await page.locator('input[name="scheduledAt"]').fill(new Date(Date.now() + 86_400_000).toISOString().slice(0, 16));
      }
      await page.locator('form[action$="/update"] button').click();
      await page.waitForURL(new RegExp(`/admin/vagas/${jobId}/editar\\?saved=1`));
    }

    const publicJob = await page.goto(`/vagas/analista-e2e-${suffix}`, { waitUntil: "domcontentloaded" });
    expect(publicJob?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();

    const articlePayload = await envelope<{ article: { id: string; slug: string } }>(
      await page.request.post("/api/admin/articles", {
        headers: { origin },
        form: {
          type: "NEWS",
          authorId: author.id,
          title: articleTitle,
          slug: `noticia-e2e-${suffix}`,
          excerpt: "Resumo editorial criado pelo teste de produção.",
          contentHtml: "<p>Conteúdo editorial completo criado para validar o fluxo administrativo.</p>",
          coverImageUrl: media.url,
          coverImageAlt: "Imagem E2E com ALT atualizado",
          section: "Testes",
          tags: "e2e, auditoria",
          seoTitle: articleTitle,
          metaDescription: "Conteúdo temporário do teste administrativo protegido.",
          status: "DRAFT"
        }
      })
    );
    const article = articlePayload.data!.article;

    await page.goto(`/admin/conteudo/${article.id}/editar`);
    await page.locator('select[name="status"]').selectOption("SCHEDULED");
    await page.locator('input[name="scheduledAt"]').fill(new Date(Date.now() + 86_400_000).toISOString().slice(0, 16));
    await page.locator('form[action*="/api/admin/articles/"] button').last().click();
    await page.waitForURL(new RegExp(`/admin/conteudo/${article.id}/editar\\?saved=1`));
    await page.goto(`/admin/conteudo/${article.id}/editar`);
    await page.locator('select[name="status"]').selectOption("PUBLISHED");
    await page.locator('form[action*="/api/admin/articles/"] button').last().click();
    await page.waitForURL(new RegExp(`/admin/conteudo/${article.id}/editar\\?saved=1`));
    const publicArticle = await page.goto(`/noticias/${article.slug}`, { waitUntil: "domcontentloaded" });
    expect(publicArticle?.status()).toBe(200);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{
      "Título original": `AUXILIAR IMPORTADO ${suffix}`,
      "Título público": `Auxiliar Importado ${suffix}`,
      Empresa: `Empresa Interna E2E ${suffix}`,
      Categoria: category.name,
      Cidade: city.name,
      UF: "MA",
      Descrição: "Descrição completa e válida da oportunidade importada pelo teste E2E do painel administrativo.",
      Resumo: "Resumo completo da vaga importada pelo teste E2E.",
      "Link de candidatura": "https://example.com/importada",
      Fonte: "Teste E2E",
      Validade: expiresAt,
      "Código externo": `IMPORT-${suffix}`
    }]), "Vagas");
    const xlsx = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
    const importPayload = await envelope(
      await page.request.post("/api/admin/imports", {
        headers: { origin },
        multipart: {
          mode: "DRAFT",
          file: { name: `vagas-${suffix}.xlsx`, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer: xlsx }
        }
      })
    );
    const batchId = new URL(importPayload.redirect!, baseUrl).searchParams.get("batch");
    expect(batchId).toBeTruthy();
    await envelope(
      await page.request.post(`/api/admin/imports/${batchId}/configure`, {
        headers: { origin },
        form: {
          sheetName: "Vagas",
          mode: "DRAFT",
          duplicateStrategy: "IGNORE",
          map_originalTitle: "Título original",
          map_title: "Título público",
          map_company: "Empresa",
          map_category: "Categoria",
          map_city: "Cidade",
          map_state: "UF",
          map_description: "Descrição",
          map_summary: "Resumo",
          map_applyUrl: "Link de candidatura",
          map_source: "Fonte",
          map_expiresAt: "Validade",
          map_externalId: "Código externo"
        }
      })
    );
    await expect.poll(async () => {
      const response = await page.request.get(`/admin/vagas/importar?batch=${batchId}&step=resultado`);
      return (await response.text()).includes("COMPLETED");
    }, { timeout: 60_000 }).toBe(true);
    await envelope(await page.request.post(`/api/admin/imports/${batchId}/undo`, { headers: { origin }, form: {} }));

    for (const [name, mimeType, buffer, status, code] of [
      ["vazio.csv", "text/csv", Buffer.alloc(0), 400, "EMPTY_FILE"],
      ["falso.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Buffer.from("não é xlsx"), 415, "FILE_SIGNATURE_MISMATCH"],
      ["binario.csv", "text/csv", Buffer.from([65, 0, 66]), 415, "FILE_SIGNATURE_MISMATCH"]
    ] as const) {
      const response = await page.request.post("/api/admin/imports", {
        headers: { origin },
        multipart: { mode: "DRY_RUN", file: { name, mimeType, buffer } },
        failOnStatusCode: false
      });
      const payload = await response.json();
      expect(response.status()).toBe(status);
      expect(payload).toMatchObject({ ok: false, code });
    }

    await envelope(await page.request.post(`/api/admin/jobs/${jobId}/status`, { headers: { origin }, form: { status: "ARCHIVED" } }));
    await page.goto(`/admin/conteudo/${article.id}/editar`);
    await page.locator('select[name="status"]').selectOption("ARCHIVED");
    await page.locator('input[name="coverImageUrl"]').fill("");
    await page.locator('input[name="coverImageAlt"]').fill("");
    await page.locator('form[action*="/api/admin/articles/"] button').last().click();
    await page.waitForURL(new RegExp(`/admin/conteudo/${article.id}/editar\\?saved=1`));
    await envelope(await page.request.post(`/api/admin/media/${media.id}`, { headers: { origin }, form: { action: "DELETE" } }));

    expect(unexpected).toEqual([]);
  });
});
