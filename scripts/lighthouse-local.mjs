#!/usr/bin/env node
/**
 * Roda Lighthouse nas URLs principais (requer: npm i -D lighthouse chrome-launcher).
 * Uso: npm run lighthouse:local
 *      SITE_URL=http://127.0.0.1:3000 npm run lighthouse:local
 */
const base =
  process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:3000";

const paths = [
  "/",
  "/vagas",
  "/noticias",
  "/empresas",
  "/contato",
  "/sobre",
  "/privacidade",
  "/publicar-vaga"
];

async function main() {
  let lighthouse;
  let chromeLauncher;
  try {
    lighthouse = (await import("lighthouse")).default;
    chromeLauncher = await import("chrome-launcher");
  } catch {
    console.error("Instale dependências opcionais: npm i -D lighthouse chrome-launcher");
    console.error("Ou teste manualmente em https://pagespeed.web.dev/");
    process.exit(1);
  }

  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

  for (const path of paths) {
    const url = new URL(path, base).toString();
    const result = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: ["performance", "seo", "accessibility", "best-practices"]
    });
    const scores = result.lhr.categories;
    console.log(`\n${url}`);
    for (const [key, cat] of Object.entries(scores)) {
      console.log(`  ${key}: ${Math.round((cat.score ?? 0) * 100)}`);
    }
    const lcp = result.lhr.audits["largest-contentful-paint"]?.numericValue;
    const cls = result.lhr.audits["cumulative-layout-shift"]?.numericValue;
    const tbt = result.lhr.audits["total-blocking-time"]?.numericValue;
    console.log(
      `  lab: LCP ${Math.round(lcp ?? 0)} ms · CLS ${(cls ?? 0).toFixed(3)} · TBT ${Math.round(tbt ?? 0)} ms`
    );
  }

  await chrome.kill();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
