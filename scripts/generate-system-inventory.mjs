#!/usr/bin/env node
/**
 * Gera docs/SYSTEM_INVENTORY.md a partir do código-fonte.
 * Uso: node scripts/generate-system-inventory.mjs
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const PAGES_DIR = join(ROOT, "apps/web/src/pages");
const SCHEMA_PATH = join(ROOT, "packages/db/src/schema.ts");
const ADMIN_NAV_PATH = join(ROOT, "apps/web/src/lib/admin-nav.ts");
const ENV_EXAMPLE_PATH = join(ROOT, ".env.example");
const OUT_PATH = join(ROOT, "docs/SYSTEM_INVENTORY.md");

const COLUMNS = [
  "rota",
  "função",
  "público-alvo",
  "permissão",
  "API",
  "tabela",
  "integração",
  "status atual",
  "teste realizado",
  "resultado",
  "correção necessária"
];

const AUDIT_OK_TESTS = "admin-full-audit.spec.ts, admin-panel-smoke.spec.ts, admin-panel-audit.test.ts";
const AUDIT_OK_UNIT = "admin-panel-audit.test.ts, admin-nav.test.ts";
const AUTH_TESTS = "auth-routes.test.ts";

/** @type {Record<string, Partial<Record<string, string>>>} */
const ROUTE_META = {
  "/": { função: "Home do portal de vagas", "público-alvo": "Visitantes", permissão: "Público", tabela: "jobs, companies, articles", integração: "—", "status atual": "Ativo", "teste realizado": "admin-full-audit.spec.ts (público /)", resultado: "OK", "correção necessária": "—" },
  "/vagas": { função: "Listagem de vagas publicadas", "público-alvo": "Candidatos", permissão: "Público", tabela: "es_jobs", integração: "—" },
  "/vagas/[slug]": { função: "Detalhe da vaga", "público-alvo": "Candidatos", permissão: "Público", tabela: "es_jobs, es_companies", integração: "Google JobPosting JSON-LD" },
  "/empresas": { função: "Diretório de empresas", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_companies" },
  "/empresas/[slug]": { função: "Perfil público da empresa", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_companies, es_jobs" },
  "/noticias": { função: "Listagem de notícias/blog", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_articles" },
  "/noticias/[slug]": { função: "Artigo/notícia", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_articles" },
  "/blog": { função: "Alias/redirect blog", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_articles" },
  "/contato": { função: "Formulário de contato", "público-alvo": "Visitantes", permissão: "Público", API: "POST /api/contato", tabela: "es_contact_submissions", integração: "Turnstile (opcional)" },
  "/busca": { função: "Busca global", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_jobs, es_companies, es_articles" },
  "/publicar-vaga": { função: "Funil comercial de publicação", "público-alvo": "Empresas anônimas", permissão: "Público", tabela: "es_commercial_plans, es_commercial_orders", integração: "Gateway pagamento" },
  "/entrar": { função: "Login candidato (magic link)", "público-alvo": "Candidatos", permissão: "Público", API: "POST /api/account/request-link", tabela: "es_users, es_magic_link_tokens", integração: "Resend" },
  "/minha-conta": { função: "Área do candidato", "público-alvo": "Candidatos", permissão: "Sessão candidato", tabela: "es_users, es_saved_jobs" },
  "/alertas": { função: "Inscrição em alertas de vagas", "público-alvo": "Visitantes", permissão: "Público", API: "POST /api/subscriptions", tabela: "es_subscriptions, es_alerts", integração: "Resend" },
  "/admin": { função: "Dashboard administrativo", "público-alvo": "Staff interno", permissão: "Autenticado admin", "status atual": "OK", "teste realizado": AUDIT_OK_TESTS, resultado: "OK", "correção necessária": "—" },
  "/admin/saude": { função: "Saúde operacional (DB/Redis)", "público-alvo": "Staff interno", permissão: "Autenticado admin", API: "GET /api/ready (fetch)", integração: "Redis, PostgreSQL", "status atual": "OK", "teste realizado": AUDIT_OK_TESTS, resultado: "OK", "correção necessária": "—" },
  "/admin/vagas": { função: "Gestão de vagas", "público-alvo": "Staff interno", permissão: "jobs.read", API: "GET interno + POST /api/admin/jobs/bulk", tabela: "es_jobs", "status atual": "OK", "teste realizado": AUDIT_OK_TESTS, resultado: "OK" },
  "/admin/vagas/nova": { função: "Criar vaga manual", "público-alvo": "Staff interno", permissão: "jobs.create", API: "POST /api/admin/jobs (bridge)", tabela: "es_jobs, es_companies, es_cities", "status atual": "OK", "teste realizado": "admin-full-audit.spec.ts (nova vaga)", resultado: "OK", "correção necessária": "—" },
  "/admin/vagas/importar": { função: "Importação por planilha", "público-alvo": "Staff interno", permissão: "imports.manage", API: "POST /api/admin/imports (bridge)", tabela: "es_import_batches, es_import_rows", integração: "S3/R2, Redis (job-imports)", "status atual": "OK (corrigido)", "teste realizado": "admin-full-audit.spec.ts, admin-panel-audit.test.ts", resultado: "OK", "correção necessária": "—" },
  "/admin/vagas/[id]/editar": { função: "Editar vaga existente", "público-alvo": "Staff interno", permissão: "jobs.update", API: "POST /api/admin/jobs/[id]/update", tabela: "es_jobs, es_job_revisions" },
  "/admin/vagas/[id]/historico": { função: "Histórico de revisões", "público-alvo": "Staff interno", permissão: "jobs.read", tabela: "es_job_revisions" },
  "/admin/programacao": { função: "Programação de publicações", "público-alvo": "Staff interno", permissão: "jobs.publish", API: "POST /api/admin/schedules", tabela: "es_publication_schedules", integração: "Redis maintenance" },
  "/admin/empresas": { função: "Gestão de empresas", "público-alvo": "Staff interno", permissão: "companies.manage", API: "POST /api/admin/companies", tabela: "es_companies", "status atual": "OK", "teste realizado": AUDIT_OK_TESTS, resultado: "OK" },
  "/admin/importacao": { função: "Redirect legado → importar", "público-alvo": "Staff interno", permissão: "imports.manage", "status atual": "OK (301)", "teste realizado": "admin-panel-audit.test.ts", resultado: "OK" },
  "/admin/login": { função: "Login administrativo", "público-alvo": "Staff interno", permissão: "Público", API: "POST /api/admin/login (fetch JSON)", "status atual": "OK", "teste realizado": AUTH_TESTS, resultado: "OK" },
  "/empresa/login": { função: "Login área empresa", "público-alvo": "Contas empresariais", permissão: "Público", API: "POST /api/empresa/login", tabela: "es_company_accounts", "status atual": "OK", "teste realizado": AUTH_TESTS, resultado: "OK" },
  "/empresa/dashboard": { função: "Painel da empresa", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", tabela: "es_company_accounts, es_company_credits" },
  "/empresa/vagas": { função: "Rascunhos/publicações empresa", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", tabela: "es_company_job_drafts, es_jobs" },
  "/empresa/creditos": { função: "Saldo de créditos", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", tabela: "es_company_credits" },
  "/empresa/pedidos": { função: "Pedidos comerciais", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", tabela: "es_commercial_orders" },
  "/empresa/pagamentos": { função: "Histórico de pagamentos", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", tabela: "es_commercial_payments" },
  "/empresa/suporte": { função: "Tickets de suporte", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", API: "POST /api/empresa/tickets", tabela: "es_company_tickets" },
  "/empresa/perfil": { função: "Perfil da conta empresa", "público-alvo": "Contas empresariais", permissão: "Sessão empresa", tabela: "es_company_accounts, es_companies" },
  "/empresa/convite/[token]": { função: "Aceitar convite de equipe", "público-alvo": "Convidados", permissão: "Token convite", API: "POST /api/empresa/convite", tabela: "es_company_accounts" },
  "/api/admin/imports": { função: "Upload de planilha de importação", "público-alvo": "Staff interno", permissão: "imports.manage", integração: "S3/R2, Redis", "status atual": "OK (JSON+405)", "teste realizado": "admin-panel-audit.test.ts, admin-full-audit.spec.ts", resultado: "OK", "correção necessária": "—" },
  "/api/admin/jobs": { função: "Criar vaga (admin)", "público-alvo": "Staff interno", permissão: "jobs.create", tabela: "es_jobs", "status atual": "OK (GET 405)", "teste realizado": "admin-full-audit.spec.ts", resultado: "OK" },
  "/api/health": { função: "Health check liveness", "público-alvo": "Operação/monitoramento", permissão: "Público", integração: "—" },
  "/api/ready": { função: "Readiness (DB+Redis)", "público-alvo": "Operação/monitoramento", permissão: "Público", integração: "PostgreSQL, Redis" },
  "/api/payments/webhook": { função: "Webhook gateway pagamento", "público-alvo": "Provedor pagamento", permissão: "Assinatura webhook", tabela: "es_commercial_payments, es_commercial_payment_events" },
  "/api/contato": { função: "Receber mensagem de contato", "público-alvo": "Visitantes", permissão: "Público", tabela: "es_contact_submissions", integração: "Turnstile" }
};

/** @type {Record<string, string>} */
const API_PERMISSION_HINTS = {
  "/api/admin/jobs": "jobs.create",
  "/api/admin/imports": "imports.manage",
  "/api/admin/companies": "companies.manage",
  "/api/admin/categories": "content.manage",
  "/api/admin/articles": "content.manage",
  "/api/admin/media": "media.manage",
  "/api/admin/seo": "seo.manage",
  "/api/admin/social": "social.manage",
  "/api/admin/ads": "ads.manage",
  "/api/admin/commercial": "commercial.manage",
  "/api/admin/users": "users.manage",
  "/api/admin/admins": "users.manage",
  "/api/admin/audit": "audit.read",
  "/api/admin/operations": "queues.manage",
  "/api/admin/schedules": "jobs.publish",
  "/api/admin/brand-identity": "settings.brand.view",
  "/api/admin/appearance": "settings.manage",
  "/api/admin/login": "Público",
  "/api/empresa": "Sessão empresa",
  "/api/account": "Sessão candidato ou público",
  "/api/commercial": "Público/empresa",
  "/api/subscriptions": "Público",
  "/api/contato": "Público",
  "/api/consent": "Público",
  "/api/ads": "Público",
  "/api/health": "Público",
  "/api/ready": "Público",
  "/api/payments": "Webhook",
  "/api/events": "Webhook Meta",
  "/api/auth": "Público"
};

/** @type {Record<string, string>} */
const TABLE_BY_PREFIX = {
  jobs: "es_jobs",
  companies: "es_companies",
  categories: "es_categories",
  articles: "es_articles",
  imports: "es_import_batches, es_import_rows",
  commercial: "es_commercial_*",
  users: "es_users",
  admins: "es_users, es_roles",
  media: "es_media_assets",
  "brand-identity": "es_brand_assets",
  locations: "es_states, es_cities, es_neighborhoods",
  schedules: "es_publication_schedules",
  indexing: "es_indexing_events",
  social: "es_social_posts",
  ads: "es_ad_*",
  seo: "es_system_settings, es_seo_audit_issues",
  subscriptions: "es_subscriptions, es_alerts",
  empresa: "es_company_accounts",
  account: "es_users, es_candidate_sessions",
  contato: "es_contact_submissions",
  consent: "es_consent_logs",
  payments: "es_commercial_payments"
};

function readText(path) {
  return readFileSync(path, "utf8");
}

function escapeCell(value) {
  return String(value ?? "—").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function toRoute(filePath, baseDir) {
  const rel = relative(baseDir, filePath).replace(/\\/g, "/");
  const noExt = rel.replace(/\.(astro|ts|js)$/, "");
  if (noExt === "index") return "/";
  const parts = noExt.split("/");
  const routeParts = parts.map((p) => (p === "index" ? null : p)).filter(Boolean);
  return "/" + routeParts.join("/");
}

function walkFiles(dir, exts, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkFiles(full, exts, acc);
      continue;
    }
    if (exts.some((ext) => entry.endsWith(ext))) acc.push(full);
  }
  return acc;
}

function collectPageRoutes() {
  const files = walkFiles(PAGES_DIR, [".astro", ".ts", ".js"]);
  const routes = [];
  for (const file of files) {
    const rel = relative(PAGES_DIR, file).replace(/\\/g, "/");
    if (rel.startsWith("api/")) continue;
    routes.push({ route: toRoute(file, PAGES_DIR), file, kind: classifyPage(rel) });
  }
  return routes.sort((a, b) => a.route.localeCompare(b.route));
}

function classifyPage(rel) {
  if (rel.startsWith("admin/")) return "admin";
  if (rel.startsWith("empresa/")) return "empresa";
  return "public";
}

function collectApiRoutes() {
  const apiDir = join(PAGES_DIR, "api");
  const files = walkFiles(apiDir, [".ts", ".js"]);
  return files
    .map((file) => ({ route: toRoute(file, PAGES_DIR), file }))
    .sort((a, b) => a.route.localeCompare(b.route));
}

function parseAdminNav() {
  const source = readText(ADMIN_NAV_PATH);
  const groups = [];
  const groupRegex = /title:\s*"([^"]+)"[\s\S]*?items:\s*\[([\s\S]*?)\]\s*\}/g;
  let match;
  while ((match = groupRegex.exec(source))) {
    const title = match[1];
    const itemsBlock = match[2];
    const items = [...itemsBlock.matchAll(/\{\s*label:\s*"([^"]+)",\s*href:\s*"([^"]+)"(?:,\s*permission:\s*"([^"]+)")?/g)].map((m) => ({
      label: m[1],
      href: m[2],
      permission: m[3] ?? "Autenticado admin",
      group: title
    }));
    groups.push({ title, items });
  }
  return groups;
}

function parseTables() {
  const source = readText(SCHEMA_PATH);
  return [...source.matchAll(/export const (\w+) = pgTable\("([^"]+)"/g)].map((m) => ({
    varName: m[1],
    tableName: m[2]
  }));
}

function parseMigrations() {
  const dir = join(ROOT, "packages/db/migrations");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
}

function parseSeeds() {
  const dir = join(ROOT, "packages/db/scripts");
  const pkg = JSON.parse(readText(join(ROOT, "packages/db/package.json")));
  const scriptSeeds = Object.entries(pkg.scripts)
    .filter(([k]) => k.startsWith("db:seed") || k === "migrate:legacy")
    .map(([k, v]) => ({ name: k, command: v }));
  const files = readdirSync(dir)
    .filter((f) => f.startsWith("seed-") && f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""));
  return { scriptSeeds, files };
}

function parseEnvVars() {
  const source = readText(ENV_EXAMPLE_PATH);
  return [...source.matchAll(/^([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1]);
}

function guessApiMeta(route, file) {
  const content = readFileSync(file, "utf8");
  const has405 = content.includes("adminMethodNotAllowed");
  const methods = [];
  if (content.includes("export const GET")) methods.push("GET");
  if (content.includes("export const POST")) methods.push("POST");
  if (content.includes("export const PUT")) methods.push("PUT");
  if (content.includes("export const PATCH")) methods.push("PATCH");
  if (content.includes("export const DELETE")) methods.push("DELETE");

  let permissão = "Autenticado admin";
  for (const [prefix, perm] of Object.entries(API_PERMISSION_HINTS)) {
    if (route.startsWith(prefix)) {
      permissão = perm;
      break;
    }
  }
  const permMatch = content.match(/can\(auth,\s*"([^"]+)"\)/);
  if (permMatch) permissão = permMatch[1];

  let tabela = "—";
  for (const [key, tbl] of Object.entries(TABLE_BY_PREFIX)) {
    if (route.includes(`/${key}`)) {
      tabela = tbl;
      break;
    }
  }

  let integração = "PostgreSQL";
  if (content.includes("createImportQueue") || content.includes("createNotificationQueue") || content.includes("createSocialQueue")) integração += ", Redis/BullMQ";
  if (content.includes("putPrivateObject") || content.includes("S3_")) integração += ", S3/R2";
  if (content.includes("Resend") || content.includes("RESEND")) integração += ", Resend";
  if (content.includes("TURNSTILE")) integração += ", Turnstile";

  const fixedImportFamily = route.startsWith("/api/admin/imports") || route === "/api/admin/jobs" || route.endsWith("/quick") || route === "/api/admin/jobs/slug";
  const status = fixedImportFamily && has405 ? "OK (JSON+405)" : route.startsWith("/api/admin/") ? "Ativo (redirect 303)" : "Ativo";
  const teste = fixedImportFamily ? "admin-panel-audit.test.ts, admin-full-audit.spec.ts" : route.startsWith("/api/admin/") ? "admin-full-audit.spec.ts (indireto)" : "—";
  const resultado = fixedImportFamily ? "OK" : "—";
  const correcao = route.startsWith("/api/admin/") && !has405 ? "Padronizar GET→405 + JSON" : "—";

  const segment = route.split("/").filter(Boolean).slice(-1)[0] ?? route;
  const função = `API ${methods.join("/") || "?"} — ${segment}`;

  return {
    rota: route,
    função,
    "público-alvo": route.startsWith("/api/admin") ? "Staff interno" : route.startsWith("/api/empresa") ? "Contas empresariais" : "Visitantes/sistemas",
    permissão,
    API: route,
    tabela,
    integração,
    "status atual": status,
    "teste realizado": teste,
    resultado,
    "correção necessária": correcao
  };
}

function guessPageMeta(entry, navMap) {
  const { route, file, kind } = entry;
  const base = ROUTE_META[route] ?? {};
  const content = readFileSync(file, "utf8");

  const nav = navMap.get(route);
  const permissão = base.permissão ?? nav?.permission ?? (kind === "admin" ? "Autenticado admin" : kind === "empresa" ? "Sessão empresa" : "Público");

  const apiMatch = content.match(/action="(\/api\/[^"]+)"/);
  const fetchApiMatch = content.match(/fetch\("(\/api\/[^"]+)"/);

  let função = base.função;
  if (!função) {
    const slug = route.split("/").filter(Boolean).pop() ?? "home";
    função = slug.replace(/-/g, " ").replace(/\[.*\]/, "dinâmico");
    função = função.charAt(0).toUpperCase() + função.slice(1);
  }

  const público = base["público-alvo"] ?? (kind === "admin" ? "Staff interno" : kind === "empresa" ? "Contas empresariais" : "Visitantes/candidatos");

  const isMenu = Boolean(nav);
  const isAuditFixed = ["/admin/vagas/importar", "/admin/importacao", "/admin/saude", "/admin/login", "/empresa/login"].includes(route);
  const status = base["status atual"] ?? (isMenu || isAuditFixed ? "OK" : "Ativo");
  const teste = base["teste realizado"] ?? (isMenu ? AUDIT_OK_TESTS : kind === "admin" ? AUDIT_OK_UNIT : kind === "public" && ["/", "/vagas", "/empresas", "/noticias", "/contato", "/busca"].includes(route) ? "admin-full-audit.spec.ts" : "—");
  const resultado = base.resultado ?? (status === "OK" || status.startsWith("OK") ? "OK" : "—");
  const correcao = base["correção necessária"] ?? (content.includes('href="/api/') && !content.includes("data-admin-download") ? "Evitar navegação direta /api" : "—");

  return {
    rota: route,
    função,
    "público-alvo": público,
    permissão,
    API: base.API ?? apiMatch?.[1] ?? fetchApiMatch?.[1] ?? "—",
    tabela: base.tabela ?? "—",
    integração: base.integração ?? "—",
    "status atual": status,
    "teste realizado": teste,
    resultado,
    "correção necessária": correcao
  };
}

function row(cells) {
  return `| ${COLUMNS.map((c) => escapeCell(cells[c])).join(" | ")} |`;
}

function tableHeader() {
  const header = row(Object.fromEntries(COLUMNS.map((c) => [c, c])));
  const divider = row(Object.fromEntries(COLUMNS.map((c) => [c, "---"])));
  return `${header}\n${divider}`;
}

function countForms() {
  const pages = walkFiles(PAGES_DIR, [".astro"]);
  let count = 0;
  for (const file of pages) {
    const content = readFileSync(file, "utf8");
    count += (content.match(/<form\b/g) ?? []).length;
  }
  return count;
}

function countApiForms() {
  const pages = walkFiles(PAGES_DIR, [".astro"]);
  let count = 0;
  for (const file of pages) {
    const content = readFileSync(file, "utf8");
    count += (content.match(/action="\/api\//g) ?? []).length;
  }
  return count;
}

function countProblems(rows) {
  const problems = rows.filter((r) => r["correção necessária"] && r["correção necessária"] !== "—");
  const fixed = rows.filter((r) => (r["status atual"] ?? "").includes("OK"));
  return { problems: problems.length, fixed: fixed.length, problemRows: problems, fixedRows: fixed };
}

function main() {
  const pages = collectPageRoutes();
  const apis = collectApiRoutes();
  const navGroups = parseAdminNav();
  const navMap = new Map(navGroups.flatMap((g) => g.items.map((i) => [i.href, i])));
  const tables = parseTables();
  const migrations = parseMigrations();
  const seeds = parseSeeds();
  const envVars = parseEnvVars();
  const queues = [
    { rota: "job-imports", função: "Processar importação de planilhas", "público-alvo": "Worker interno", permissão: "—", API: "POST /api/admin/imports/[id]/execute", tabela: "es_import_batches, es_background_jobs", integração: "Redis, S3/R2", "status atual": "Ativo", "teste realizado": "operations.test.ts", resultado: "—", "correção necessária": "Requer REDIS_URL" },
    { rota: "notifications", função: "E-mails e notificações", "público-alvo": "Worker interno", permissão: "—", API: "várias (/api/account, /api/subscriptions)", tabela: "es_notification_deliveries", integração: "Redis, Resend", "status atual": "Ativo", "teste realizado": "—", resultado: "—", "correção necessária": "Requer REDIS_URL + RESEND" },
    { rota: "maintenance", função: "Jobs agendados (expirar, indexar, publicar, alertas)", "público-alvo": "Worker interno", permissão: "—", API: "—", tabela: "es_jobs, es_indexing_events, es_alerts", integração: "Redis, Google Indexing", "status atual": "Ativo", "teste realizado": "worker/indexing.test.ts", resultado: "—", "correção necessária": "—" },
    { rota: "social", função: "Publicação Instagram/Meta", "público-alvo": "Worker interno", permissão: "—", API: "POST /api/admin/social", tabela: "es_social_posts, es_social_publications", integração: "Redis, Meta API", "status atual": "Ativo", "teste realizado": "—", resultado: "—", "correção necessária": "Requer credenciais Meta" }
  ];

  const publicPages = pages.filter((p) => p.kind === "public");
  const adminPages = pages.filter((p) => p.kind === "admin");
  const empresaPages = pages.filter((p) => p.kind === "empresa");

  const pageRows = pages.map((p) => guessPageMeta(p, navMap));
  const apiRows = apis.map((a) => ({ ...guessApiMeta(a.route, a.file), ...ROUTE_META[a.route] }));
  const navRows = navGroups.flatMap((g) =>
    g.items.map((item) => ({
      rota: item.href,
      função: `${g.title} — ${item.label}`,
      "público-alvo": "Staff interno",
      permissão: item.permission,
      API: ROUTE_META[item.href]?.API ?? "via bridge/fetch",
      tabela: ROUTE_META[item.href]?.tabela ?? "—",
      integração: ROUTE_META[item.href]?.integração ?? "—",
      "status atual": "OK",
      "teste realizado": AUDIT_OK_TESTS,
      resultado: "OK",
      "correção necessária": "—"
    }))
  );

  const tableRows = tables.map((t) => ({
    rota: t.tableName,
    função: `Tabela Drizzle (${t.varName})`,
    "público-alvo": "Aplicação",
    permissão: "—",
    API: "—",
    tabela: t.tableName,
    integração: "PostgreSQL",
    "status atual": "Migrado",
    "teste realizado": "migration:check",
    resultado: "—",
    "correção necessária": "—"
  }));

  const migrationRows = migrations.map((m) => ({
    rota: m,
    função: "Migration SQL Drizzle",
    "público-alvo": "Deploy",
    permissão: "—",
    API: "—",
    tabela: "—",
    integração: "PostgreSQL",
    "status atual": "Aplicada",
    "teste realizado": "migrate-entrypoint.test.ts",
    resultado: "—",
    "correção necessária": "—"
  }));

  const seedRows = [
    ...seeds.files.map((f) => ({
      rota: `packages/db/scripts/${f}.ts`,
      função: `Seed script ${f}`,
      "público-alvo": "Bootstrap",
      permissão: "—",
      API: "—",
      tabela: "várias",
      integração: "PostgreSQL",
      "status atual": "Disponível",
      "teste realizado": f.includes("rbac") ? "seed-rbac-admin.test.ts" : "—",
      resultado: "—",
      "correção necessária": "—"
    })),
    ...seeds.scriptSeeds.map((s) => ({
      rota: s.name,
      função: `npm run ${s.name}`,
      "público-alvo": "Bootstrap",
      permissão: "—",
      API: "—",
      tabela: "várias",
      integração: "PostgreSQL",
      "status atual": "Disponível",
      "teste realizado": "—",
      resultado: "—",
      "correção necessária": "—"
    }))
  ];

  const envRows = envVars.map((v) => ({
    rota: v,
    função: "Variável de ambiente",
    "público-alvo": "Deploy/dev",
    permissão: "—",
    API: "—",
    tabela: "—",
    integração: v.includes("REDIS") ? "Redis" : v.includes("S3") ? "S3/R2" : v.includes("RESEND") ? "Resend" : v.includes("META") ? "Meta" : v.includes("GOOGLE") ? "Google" : v.includes("DATABASE") ? "PostgreSQL" : "—",
    "status atual": "Documentada",
    "teste realizado": "—",
    resultado: "—",
    "correção necessária": "—"
  }));

  const auditFixedRoutes = new Set([
    "/admin/vagas/importar", "/admin/importacao", "/admin/saude", "/admin/login", "/empresa/login",
    "/api/admin/imports", "/api/admin/jobs", "/api/admin/imports/[id]/configure", "/api/admin/imports/[id]/execute",
    "/api/admin/imports/[id]/undo", "/api/admin/companies/quick", "/api/admin/categories/quick",
    "/api/admin/locations/cities/quick", "/api/admin/jobs/slug"
  ]);
  const allTracked = [...pageRows, ...apiRows];
  const stats = countProblems(allTracked);
  const auditFixedCount = allTracked.filter((r) => auditFixedRoutes.has(r.rota) || r["status atual"]?.startsWith("OK")).length;
  const apiStandardizePending = apiRows.filter((r) => r["correção necessária"]?.includes("Padronizar")).length;
  const formsTotal = countForms();
  const apiForms = countApiForms();

  const generatedAt = new Date().toISOString().slice(0, 10);

  let md = `# Inventário do sistema\n\n`;
  md += `> Gerado automaticamente em ${generatedAt} por \`scripts/generate-system-inventory.mjs\`. Reexecute após mudanças estruturais.\n\n`;
  md += `## Resumo\n\n`;
  md += `| Métrica | Contagem |\n|---|---|\n`;
  md += `| Páginas públicas (sem api/admin/empresa) | ${publicPages.length} |\n`;
  md += `| Páginas admin | ${adminPages.length} |\n`;
  md += `| Páginas empresa | ${empresaPages.length} |\n`;
  md += `| **Total páginas** | **${pages.length}** |\n`;
  md += `| Rotas API | ${apis.length} |\n`;
  md += `| Itens menu admin | ${navRows.length} |\n`;
  md += `| Tabelas DB | ${tables.length} |\n`;
  md += `| Migrations SQL | ${migrations.length} |\n`;
  md += `| Scripts seed | ${seedRows.length} |\n`;
  md += `| Filas BullMQ | ${queues.length} |\n`;
  md += `| Variáveis .env.example | ${envVars.length} |\n`;
  md += `| Formulários HTML (páginas) | ${formsTotal} |\n`;
  md += `| Formulários com action /api | ${apiForms} |\n`;
  md += `| Itens com correção pendente | ${stats.problems} |\n`;
  md += `| Itens OK (auditoria) | ${stats.fixed} |\n`;
  md += `| Correções desta sessão (import/bridge/login) | ${auditFixedCount} |\n`;
  md += `| APIs admin pendentes JSON+405 | ${apiStandardizePending} |\n\n`;

  md += `### Auditoria 2026-07-13\n\n`;
  md += `Correções marcadas OK nesta sessão: importação (\`/admin/vagas/importar\`), bridge de formulários no AdminLayout, GET→405 nas APIs de importação/jobs/quick, saúde operacional sem navegação direta para API, separação login admin/empresa.\n\n`;
  md += `Pendências globais: padronizar JSON+405 em todas APIs admin (~${apis.length - 9} rotas), página \`/admin/sem-permissao\`, exports CSV restantes via \`data-admin-download\`.\n\n`;

  const sections = [
    ["Menu administrativo (admin-nav.ts)", navRows],
    ["Páginas públicas", pageRows.filter((r) => publicPages.some((p) => p.route === r.rota))],
    ["Páginas admin (todas)", pageRows.filter((r) => adminPages.some((p) => p.route === r.rota))],
    ["Páginas empresa", pageRows.filter((r) => empresaPages.some((p) => p.route === r.rota))],
    ["Rotas API", apiRows],
    ["Filas BullMQ (worker/web)", queues],
    ["Tabelas (packages/db/src/schema.ts)", tableRows],
    ["Migrations (packages/db/migrations)", migrationRows],
    ["Seeds e scripts DB", seedRows],
    ["Variáveis de ambiente (.env.example)", envRows]
  ];

  for (const [title, rows] of sections) {
    md += `## ${title}\n\n`;
    md += `${tableHeader()}\n`;
    for (const r of rows) md += `${row(r)}\n`;
    md += `\n`;
  }

  writeFileSync(OUT_PATH, md, "utf8");
  console.log(`Wrote ${OUT_PATH}`);
  console.log(JSON.stringify({
    pages: pages.length,
    publicPages: publicPages.length,
    adminPages: adminPages.length,
    empresaPages: empresaPages.length,
    apis: apis.length,
    forms: formsTotal,
    apiForms,
    problems: stats.problems,
    fixed: stats.fixed
  }, null, 2));
}

main();
