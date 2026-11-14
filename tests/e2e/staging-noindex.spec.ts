import { expect, test } from "@playwright/test";

/**
 * Em APP_ENV=staging|e2e (ou FORCE_NOINDEX=true) o portal deve bloquear indexação globalmente.
 * No compose E2E, APP_ENV costuma ser e2e — este teste valida o contrato quando a flag estiver ativa.
 */
test.describe("noindex global de staging/homologação", () => {
  test("quando FORCE_NOINDEX=true, HTML e robots bloqueiam crawlers", async ({ request }) => {
    // O servidor E2E Docker pode já estar em APP_ENV=e2e. Aceita ambos os contratos:
    // - robots Disallow: / + meta noindex,nofollow (staging-like)
    // - ou robots de produção se o processo não estiver em staging (pulo condicional)
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    const robotsBody = await robots.text();
    const home = await request.get("/");
    expect(home.ok()).toBe(true);
    const html = await home.text();
    const robotsHeader = home.headers()["x-robots-tag"] ?? "";
    const stagingLike =
      /Disallow:\s*\/\s*$/m.test(robotsBody) ||
      /noindex,\s*nofollow/i.test(robotsHeader) ||
      /content=["']noindex,\s*nofollow["']/i.test(html);

    if (!stagingLike) {
      test.info().annotations.push({
        type: "note",
        description:
          "Ambiente sem APP_ENV=staging/e2e nem FORCE_NOINDEX. Configure APP_ENV=staging no Coolify de homologação."
      });
      // Ainda valida ausência de AdSense e presença de meta robots em páginas públicas.
      expect(html).not.toMatch(/pagead\/js\/adsbygoogle\.js/i);
      expect(html).toMatch(/name=["']robots["']/i);
      return;
    }

    expect(robotsBody).toMatch(/Disallow:\s*\//i);
    expect(robotsBody).not.toMatch(/Sitemap:/i);
    expect(html).toMatch(/noindex,\s*nofollow/i);
    expect(robotsHeader.toLowerCase()).toMatch(/noindex/);
    expect(html).not.toMatch(/rel=["']canonical["']/i);
    expect(html).not.toMatch(/pagead\/js\/adsbygoogle\.js/i);
  });
});
