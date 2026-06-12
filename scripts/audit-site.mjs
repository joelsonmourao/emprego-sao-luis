#!/usr/bin/env node
/**
 * Auditoria pré-deploy do Emprego São Luís.
 * Uso:
 *   npm run audit:site
 *   npm run audit:site -- --live
 *   SITE_URL=https://empregossaoluis.com.br npm run audit:site -- --live
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const live = process.argv.includes("--live");
const base =
  process.argv.find((arg) => arg.startsWith("http"))?.trim() ||
  process.env.SITE_URL?.trim() ||
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "http://127.0.0.1:3000";

const issues = [];
const warnings = [];
const ok = [];

function addIssue(code, message, detail) {
  issues.push({ code, message, detail });
}

function addWarning(code, message, detail) {
  warnings.push({ code, message, detail });
}

function addOk(message) {
  ok.push(message);
}

function readText(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf8");
}

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") continue;
      walk(full, acc);
    } else if (/\.(tsx?|jsx?|mjs|md|json|txt|css)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const LEGACY_PATTERNS = [
  { code: "legacy-brand", pattern: /Jovem Aprendiz Vagas/i, note: "marca do projeto anterior" },
  { code: "legacy-domain", pattern: /slzcontent\.com\.br/i, note: "domínio antigo" },
  { code: "legacy-route", pattern: /\/vagas\/jovem-aprendiz/i, note: "rota legada" },
  { code: "legacy-route", pattern: /\/menor-aprendiz/i, note: "rota legada" },
  { code: "legacy-route", pattern: /\/estados\b/i, note: "hub nacional legado" },
  { code: "placeholder", pattern: /lorem ipsum/i, note: "conteúdo placeholder" },
  { code: "placeholder", pattern: /em constru[cç][aã]o/i, note: "página em construção" }
];

const INSTITUTIONAL_ROUTES = [
  "/",
  "/vagas",
  "/empresas",
  "/categorias",
  "/blog",
  "/quem-somos",
  "/sobre",
  "/contato",
  "/anunciar-vaga",
  "/privacidade",
  "/termos",
  "/cookies"
];

const APP_ROUTE_FILES = {
  "/": "app/page.tsx",
  "/vagas": "app/vagas/page.tsx",
  "/empresas": "app/empresas/page.tsx",
  "/categorias": "app/categorias/page.tsx",
  "/blog": "app/blog/page.tsx",
  "/quem-somos": "app/quem-somos/page.tsx",
  "/sobre": "app/sobre/page.tsx",
  "/contato": "app/contato/page.tsx",
  "/anunciar-vaga": "app/anunciar-vaga/page.tsx",
  "/privacidade": "app/privacidade/page.tsx",
  "/termos": "app/termos/page.tsx",
  "/cookies": "app/cookies/page.tsx"
};

function auditSourceFiles() {
  const files = walk(root);
  const hits = new Map();

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, "/");
    if (rel.startsWith("scripts/audit-site.mjs")) continue;
    if (rel === "next.config.js") continue;
    if (rel === "README.md" || rel === "ADSENSE-CHECKLIST.md") continue;
    const text = fs.readFileSync(file, "utf8");
    for (const rule of LEGACY_PATTERNS) {
      if (rule.pattern.test(text)) {
        const key = `${rule.code}:${rel}`;
        if (!hits.has(key)) hits.set(key, { ...rule, file: rel });
      }
    }
  }

  for (const hit of hits.values()) {
    if (hit.file.includes("data/emprego-sao-luis-blog-posts.ts") && hit.code === "legacy-route") continue;
    if (hit.file.includes("lib/job-categories.ts") && hit.note.includes("rota")) continue;
    addWarning(hit.code, `${hit.note} em ${hit.file}`, hit.pattern.toString());
  }

  if (hits.size === 0) addOk("Nenhuma referência crítica legada encontrada no código-fonte.");
}

function auditInstitutionalPages() {
  for (const route of INSTITUTIONAL_ROUTES) {
    const file = APP_ROUTE_FILES[route];
    if (!file || !fs.existsSync(path.join(root, file))) {
      addIssue("missing-page", `Página institucional ausente: ${route}`, file ?? "sem arquivo mapeado");
    }
  }
  if (!issues.some((i) => i.code === "missing-page")) {
    addOk("Todas as páginas institucionais principais existem no app router.");
  }
}

function auditLegacyRoutesRemoved() {
  const legacyDirs = [
    "app/vagas/jovem-aprendiz",
    "app/menor-aprendiz",
    "app/cidades",
    "app/estados",
    "app/empresa"
  ];
  for (const dir of legacyDirs) {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) continue;
    const pages = walk(full).filter((f) => f.endsWith("page.tsx"));
    if (pages.length) {
      addIssue("legacy-route-file", `Ainda existe página legada em ${dir}`, pages.join(", "));
    }
  }
  if (!issues.some((i) => i.code === "legacy-route-file")) {
    addOk("Sem páginas legadas ativas em rotas antigas.");
  }
}

function auditRobotsAndAds() {
  const robots = readText("public/robots.txt");
  if (!robots) {
    addIssue("robots-missing", "public/robots.txt não encontrado");
  } else {
    if (!/empregossaoluis\.com\.br\/sitemap\.xml/i.test(robots)) {
      addIssue("robots-sitemap", "robots.txt não aponta para o sitemap do domínio empregossaoluis.com.br");
    } else {
      addOk("robots.txt aponta para o sitemap correto.");
    }
    if (/Disallow: \/\*\?page=/i.test(robots)) {
      addWarning("robots-pagination", "robots.txt bloqueia paginação (?page=) — pode afetar SEO de listagens.");
    }
  }

  const ads = readText("public/ads.txt");
  if (!ads) {
    addWarning("ads-txt-missing", "public/ads.txt ausente");
  } else if (/pub-\d{16}/i.test(ads) && !ads.trim().startsWith("#")) {
    addWarning("ads-txt-publisher", "ads.txt contém publisher — confirme se o ID é real antes do deploy.");
  } else {
    addOk("ads.txt preparado sem publisher falso.");
  }
}

function auditSitemapConfig() {
  const sitemaps = readText("lib/sitemaps.ts");
  const seoPages = readText("data/seo-pages.ts");
  if (!sitemaps) {
    addIssue("sitemap-code", "lib/sitemaps.ts ausente");
    return;
  }
  if (/jovem-aprendiz|getApprenticeCityUf|buildJovemAprendiz/i.test(sitemaps)) {
    addIssue("sitemap-legacy", "lib/sitemaps.ts ainda referencia rotas legadas de Jovem Aprendiz");
  } else {
    addOk("lib/sitemaps.ts sem referências legadas.");
  }
  if (seoPages && /menor-aprendiz|\/estados|jovem-aprendiz/i.test(seoPages)) {
    addIssue("seo-pages-legacy", "data/seo-pages.ts ainda lista rotas antigas");
  } else {
    addOk("data/seo-pages.ts limpo.");
  }
}

function auditSeedFocus() {
  const seed = readText("prisma/seed-emprego-sao-luis.ts");
  if (!seed) {
    addIssue("seed-missing", "prisma/seed-emprego-sao-luis.ts ausente");
    return;
  }
  if (!/purgeLegacy/i.test(seed)) {
    addWarning("seed-purge", "Seed não implementa purgeLegacy para remover CE/SP e dados antigos.");
  } else {
    addOk("Seed com purgeLegacy para limpar dados fora do Maranhão.");
  }
  if (!/MARANHAO_CITIES/i.test(seed) || !/code:\s*"MA"/i.test(seed)) {
    addIssue("seed-scope", "Seed não está claramente limitado ao Maranhão (MA)");
  } else {
    addOk("Seed focado em Maranhão (MA).");
  }
}

function auditEnvExample() {
  const env = readText(".env.example");
  if (!env) {
    addWarning("env-example", ".env.example ausente");
    return;
  }
  if (!/emprego_sao_luis/i.test(env)) {
    addWarning("env-db-name", ".env.example não menciona banco emprego_sao_luis");
  }
  if (!/NEXT_PUBLIC_ADSENSE_CLIENT_ID/i.test(env)) {
    addWarning("env-adsense", ".env.example não documenta NEXT_PUBLIC_ADSENSE_CLIENT_ID");
  }
}

function extractInternalLinks(html) {
  const links = [];
  const re = /href=["'](\/[^"'#?]+)["']/gi;
  let m;
  while ((m = re.exec(html))) links.push(m[1]);
  return [...new Set(links)];
}

async function auditLive() {
  if (!live) {
    addWarning("live-skipped", "Auditoria HTTP não executada. Use --live com o servidor rodando.");
    return;
  }

  for (const route of INSTITUTIONAL_ROUTES) {
    try {
      const res = await fetch(new URL(route, base).toString(), { redirect: "manual" });
      if (res.status >= 400) {
        addIssue("http-status", `${route} retornou HTTP ${res.status}`);
      } else if (res.status >= 300 && res.status < 400) {
        addWarning("http-redirect", `${route} redireciona para ${res.headers.get("location")}`);
      } else {
        addOk(`${route} respondeu HTTP ${res.status}`);
      }
    } catch (error) {
      addIssue("http-error", `Falha ao acessar ${route}`, String(error));
    }
  }

  const legacyPaths = ["/menor-aprendiz", "/vagas/jovem-aprendiz", "/cidades", "/estados", "/vagas/estado/ce"];
  for (const route of legacyPaths) {
    try {
      const res = await fetch(new URL(route, base).toString(), { redirect: "manual" });
      const location = res.headers.get("location") ?? "";
      if (res.status >= 300 && res.status < 400 && !/jovem-aprendiz|menor-aprendiz|estados|cidades/i.test(location)) {
        addOk(`Rota legada ${route} redireciona (${res.status}).`);
      } else if (res.status === 200) {
        addIssue("legacy-live", `Rota legada ${route} ainda responde 200 sem redirecionar`);
      }
    } catch (error) {
      addWarning("legacy-live-error", `Não foi possível testar ${route}`, String(error));
    }
  }

  try {
    const sitemapRes = await fetch(new URL("/sitemap.xml", base).toString());
    const xml = await sitemapRes.text();
    if (!sitemapRes.ok) {
      addIssue("sitemap-http", `/sitemap.xml retornou HTTP ${sitemapRes.status}`);
    } else if (/jovem-aprendiz|menor-aprendiz|slzcontent|\/estados/i.test(xml)) {
      addIssue("sitemap-live-legacy", "Sitemap publicado contém URLs legadas ou fora do foco");
    } else {
      addOk("Sitemap publicado sem URLs legadas óbvias.");
    }
  } catch (error) {
    addIssue("sitemap-http-error", "Falha ao buscar /sitemap.xml", String(error));
  }

  try {
    const jobsRes = await fetch(new URL("/vagas", base).toString());
    const html = await jobsRes.text();
    const links = extractInternalLinks(html).filter((l) => l.startsWith("/") && !l.startsWith("/admin"));
    const broken = links.filter((l) => /jovem-aprendiz|menor-aprendiz|\/estados|slzcontent/i.test(l));
    if (broken.length) {
      addIssue("broken-internal-links", "Links internos legados encontrados em /vagas", broken.join(", "));
    } else {
      addOk("Página /vagas sem links internos legados óbvios.");
    }
  } catch (error) {
    addWarning("links-scan-error", "Não foi possível varrer links em /vagas", String(error));
  }
}

console.log("Auditoria Emprego São Luís");
console.log(`Raiz: ${root}`);
console.log(`Modo live: ${live ? `sim (${base})` : "não"}`);
console.log("");

auditSourceFiles();
auditInstitutionalPages();
auditLegacyRoutesRemoved();
auditRobotsAndAds();
auditSitemapConfig();
auditSeedFocus();
auditEnvExample();
await auditLive();

console.log("--- OK ---");
for (const item of ok) console.log(`✓ ${item}`);
console.log("");

if (warnings.length) {
  console.log("--- AVISOS ---");
  for (const w of warnings) console.log(`! [${w.code}] ${w.message}${w.detail ? ` — ${w.detail}` : ""}`);
  console.log("");
}

if (issues.length) {
  console.log("--- PROBLEMAS ---");
  for (const i of issues) console.log(`✗ [${i.code}] ${i.message}${i.detail ? ` — ${i.detail}` : ""}`);
  console.log("");
  console.log(`Resultado: FALHOU (${issues.length} problema(s), ${warnings.length} aviso(s))`);
  process.exit(1);
}

console.log(`Resultado: APROVADO (${warnings.length} aviso(s))`);
