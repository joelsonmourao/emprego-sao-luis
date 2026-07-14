#!/usr/bin/env node
import fs from "node:fs";

const failures = [];
const warnings = [];
const read = (file) => fs.readFileSync(file, "utf8");
const layout = read("apps/web/src/layouts/BaseLayout.astro");
const middleware = read("apps/web/src/middleware.ts");
const robots = read("apps/web/src/pages/robots.txt.ts");
const sitemaps = read("apps/web/src/lib/sitemaps.ts");
const unavailable = read("apps/web/src/pages/vagas/indisponivel/[slug].astro");

for (const [label, condition] of [
  [
    "html lang configurável com padrão pt-BR",
    layout.includes("lang={seo.language}") &&
      read("packages/seo/src/settings.ts").includes('language: "pt-BR"')
  ],
  ["canonical", layout.includes('rel="canonical"')],
  ["Open Graph", layout.includes("buildOpenGraphTags")],
  ["Twitter Card", layout.includes("buildTwitterTags")],
  ["JSON-LD @graph", layout.includes('"@graph"')],
  ["SearchAction", layout.includes("SearchAction")],
  ["redirecionamento www", middleware.includes("www.${CANONICAL_HOST}")],
  ["robots protege APIs privadas", robots.includes("Disallow: /api/")],
  [
    "sitemap só inclui vagas ativas",
    sitemaps.includes('eq(jobs.publicationStatus, "PUBLISHED")') && sitemaps.includes("gt(jobs.expiresAt")
  ],
  ["vaga indisponível responde 410", unavailable.includes("status = 410")]
])
  if (!condition) failures.push(label);

if (layout.includes("fonts.googleapis.com"))
  failures.push("Fonte remota bloqueante ainda presente no layout.");
if (read("apps/web/src/pages/404.astro").includes("canonical="))
  warnings.push("Revise manualmente a canônica da página 404.");

if (process.argv.includes("--live")) {
  const base = process.argv.find((value) => /^https?:/.test(value)) ?? process.env.SITE_URL;
  if (!base) failures.push("--live exige SITE_URL ou URL como argumento.");
  else {
    for (const route of [
      "/",
      "/vagas",
      "/noticias",
      "/empresas",
      "/robots.txt",
      "/sitemap.xml",
      "/sitemap-news.xml",
      "/feed.xml"
    ]) {
      try {
        const response = await fetch(new URL(route, base), { redirect: "manual" });
        if (response.status >= 400) failures.push(`${route} retornou ${response.status}`);
      } catch (error) {
        failures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

console.log(JSON.stringify({ ok: failures.length === 0, failures, warnings }, null, 2));
if (failures.length) process.exit(1);
