#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const checks = [];
const requiredFiles = [
  "apps/web/src/pages/index.astro",
  "apps/web/src/pages/vagas/index.astro",
  "apps/web/src/pages/noticias/index.astro",
  "apps/web/src/pages/empresas/index.astro",
  "apps/web/src/pages/robots.txt.ts",
  "apps/web/src/pages/sitemap.xml.ts",
  "apps/web/src/pages/sitemap-news.xml.ts",
  "apps/web/src/pages/feed.xml.ts",
  "apps/web/src/pages/404.astro",
  "apps/web/src/layouts/BaseLayout.astro",
  "apps/web/src/layouts/AdminLayout.astro",
  "Dockerfile.web",
  "Dockerfile.worker",
  "Dockerfile.migrate",
  "compose.staging.yml"
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) failures.push(`Arquivo obrigatório ausente: ${relative}`);
}
checks.push(`${requiredFiles.length} arquivos estruturais verificados`);

const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const middleware = read("apps/web/src/middleware.ts");
if (!middleware.includes("normalizeAdminApiResponse") || !middleware.includes("isTrustedApiOrigin"))
  failures.push("Middleware administrativo sem normalização/origem confiável.");
if (!middleware.includes("Cache-Control") || !middleware.includes("private, no-store"))
  failures.push("Política de cache privado não encontrada.");
checks.push("middleware, cache, origem e envelope administrativo");

const compose = read("compose.staging.yml");
if ((compose.match(/uploads_staging:\/app\/data/g) ?? []).length < 2)
  failures.push("Web e worker não compartilham /app/data no compose isolado.");
checks.push("volume persistente compartilhado web/worker");

const legacyRuntime = ["apps/web", "apps/worker", "packages"]
  .flatMap((directory) => walk(path.join(root, directory)))
  .filter((file) => /\.(ts|tsx|astro|mjs)$/.test(file));
for (const file of legacyRuntime) {
  const source = fs.readFileSync(file, "utf8");
  if (/from\s+["']next\//.test(source) || /@prisma\/client/.test(source))
    failures.push(`Runtime Astro contém dependência legada: ${path.relative(root, file)}`);
}
checks.push(`${legacyRuntime.length} fontes Astro/worker/pacotes sem imports Next/Prisma`);

console.log(JSON.stringify({ ok: failures.length === 0, checks, failures }, null, 2));
if (failures.length) process.exit(1);

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ["node_modules", "dist", ".astro"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}
