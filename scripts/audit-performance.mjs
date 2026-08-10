#!/usr/bin/env node
import fs from "node:fs";

const failures = [];
const layout = fs.readFileSync("apps/web/src/layouts/BaseLayout.astro", "utf8");
const consent = fs.readFileSync("apps/web/src/components/CookieConsent.astro", "utf8");
const middleware = fs.readFileSync("apps/web/src/middleware.ts", "utf8");
const news = fs.readFileSync("apps/web/src/pages/noticias/[slug].astro", "utf8");
const config = JSON.parse(fs.readFileSync("lighthouserc.json", "utf8"));
if (layout.includes("fonts.googleapis.com")) failures.push("fontes remotas bloqueantes");
if (!consent.includes("requestIdleCallback")) failures.push("consentimento não inicializa de forma ociosa");
if (/CookieConsent\.tsx|MobileNav\.tsx|client:idle/.test(layout))
  failures.push("runtime React global desnecessário no layout público");
if (!middleware.includes("stale-while-revalidate") || !middleware.includes("immutable"))
  failures.push("cache público/versionado incompleto");
if (!news.includes("srcset=") || !news.includes('fetchpriority="high"') || !news.includes("width="))
  failures.push("imagem LCP de notícia sem dimensões/srcset/prioridade");
const assertions = config?.ci?.assert?.assertions ?? {};
if ((assertions["categories:performance"]?.[1]?.minScore ?? 0) < 0.85)
  failures.push("budget Lighthouse de performance abaixo de 0.85");

const routes = ["/", "/vagas", "/vagas/:slug", "/noticias", "/noticias/:slug", "/empresas", "/publicar-vaga"];
console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      budgets: { lcpMs: 2500, cls: 0.1, inpMs: 200, lighthousePerformance: 0.85 },
      routes,
      failures
    },
    null,
    2
  )
);
if (failures.length) process.exit(1);
