#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = walk(path.join(root, "apps/web/src/pages"));
const adminPages = files.filter(
  (file) => file.endsWith(".astro") && file.includes(`${path.sep}admin${path.sep}`)
);
const adminApis = files.filter(
  (file) => /\.(ts|js)$/.test(file) && file.includes(`${path.sep}api${path.sep}admin${path.sep}`)
);
const allPages = files.filter((file) => file.endsWith(".astro"));
const forms = allPages.reduce(
  (total, file) => total + (fs.readFileSync(file, "utf8").match(/<form\b/g) ?? []).length,
  0
);
const failures = [];
const middleware = fs.readFileSync(path.join(root, "apps/web/src/middleware.ts"), "utf8");
const adminLayout = fs.readFileSync(path.join(root, "apps/web/src/layouts/AdminLayout.astro"), "utf8");
if (!middleware.includes('path.startsWith("/api/admin")') || !middleware.includes("verifySession"))
  failures.push("autenticação central das APIs admin ausente");
if (!middleware.includes("isTrustedApiOrigin")) failures.push("proteção de origem/CSRF ausente");
if (!middleware.includes("normalizeAdminApiResponse")) failures.push("envelope JSON/requestId ausente");
if (!adminLayout.includes("ADMIN_FORM_BRIDGE_SCRIPT"))
  failures.push("bridge de formulários administrativos ausente");
for (const required of [
  "apps/web/src/pages/api/admin/imports/[id]/retry.ts",
  "apps/web/src/pages/admin/vagas/importar.astro",
  "apps/web/src/pages/admin/vagas/nova.astro",
  "apps/web/src/pages/admin/conteudo/novo.astro",
  "apps/web/src/pages/admin/midia.astro",
  "apps/web/src/pages/admin/seo/auditoria.astro"
])
  if (!fs.existsSync(path.join(root, required))) failures.push(`fluxo obrigatório ausente: ${required}`);

console.log(
  JSON.stringify(
    {
      ok: failures.length === 0,
      counts: { pages: allPages.length, adminPages: adminPages.length, adminApis: adminApis.length, forms },
      failures
    },
    null,
    2
  )
);
if (failures.length) process.exit(1);

function walk(directory, output = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, output);
    else output.push(full);
  }
  return output;
}
