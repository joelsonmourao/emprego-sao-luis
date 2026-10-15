#!/usr/bin/env node
/**
 * Read-only auditor for institutional/demo placeholders.
 * Usage: DATABASE_URL=... node scripts/audit-placeholders.mjs
 * Optional write (isolated only): ALLOW_PLACEHOLDER_FIX=true APPLY_PLACEHOLDER_FIX=true
 * Never targets production unless DATABASE_URL is explicitly set by the operator.
 */
import postgres from "postgres";

const PATTERNS = [
  { id: "configuravel-painel", re: /\[configur[aá]vel no painel administrativo\]|configur[aá]vel no painel/i, severity: "P0" },
  { id: "lorem", re: /lorem ipsum/i, severity: "P0" },
  { id: "example-email", re: /exemplo@example\.com|example@example\.com/i, severity: "P1" },
  { id: "fake-phone", re: /\(00\)\s*00000-0000|99999-9999/i, severity: "P1" },
  { id: "fake-cnpj", re: /00\.000\.000\/0000-00|11\.111\.111\/1111-11/i, severity: "P1" },
  { id: "localhost", re: /https?:\/\/localhost\b|https?:\/\/127\.0\.0\.1\b/i, severity: "P1" },
  { id: "todo-fixe", re: /\bTODO\b|\bFIXME\b/i, severity: "P2" },
  { id: "demo", re: /\bdemo\b|\bplaceholder\b|\btexto de exemplo\b/i, severity: "P2" }
];

const TARGETS = [
  {
    table: "es_articles",
    id: "id",
    fields: ["title", "excerpt", "content_html", "seo_title", "meta_description"],
    route: (row) => (row.type === "NEWS" ? `/noticias/${row.slug}` : `/blog/${row.slug}`)
  },
  { table: "es_settings", id: "key", fields: ["value"], route: (row) => (row.key === "institutional_pages" ? "/admin/paginas" : `/admin/configuracoes`) },
  {
    table: "es_jobs",
    id: "id",
    fields: ["normalized_title", "summary", "description", "description_html", "source_name"],
    route: (row) => `/vagas/${row.slug}`
  }
];

function scanValue(value, patterns) {
  const text = typeof value === "string" ? value : value == null ? "" : JSON.stringify(value);
  if (!text) return [];
  return patterns.filter((pattern) => pattern.re.test(text)).map((pattern) => ({
    pattern: pattern.id,
    severity: pattern.severity,
    excerpt: text.replace(/\s+/g, " ").trim().slice(0, 180)
  }));
}

export async function auditPlaceholders(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) throw new Error("DATABASE_URL é obrigatória.");
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  const findings = [];
  try {
    for (const target of TARGETS) {
      const exists = await sql`
        select 1 from information_schema.tables
         where table_schema = 'public' and table_name = ${target.table}
         limit 1
      `;
      if (!exists.length) continue;
      const rows = await sql.unsafe(`select * from ${target.table}`);
      for (const row of rows) {
        for (const field of target.fields) {
          const hits = scanValue(row[field], PATTERNS);
          for (const hit of hits) {
            findings.push({
              table: target.table,
              record: String(row[target.id] ?? row.slug ?? row.key ?? "?"),
              field,
              pattern: hit.pattern,
              severity: hit.severity,
              value: hit.excerpt,
              route: typeof target.route === "function" ? target.route(row) : null,
              suggestion:
                hit.severity === "P0"
                  ? "Revisar no painel e republicar sem placeholder."
                  : "Revisar conteúdo e remover texto de demonstração."
            });
          }
        }
      }
    }
    return {
      ok: findings.filter((item) => item.severity === "P0").length === 0,
      checkedAt: new Date().toISOString(),
      findings,
      p0: findings.filter((item) => item.severity === "P0").length,
      p1: findings.filter((item) => item.severity === "P1").length,
      p2: findings.filter((item) => item.severity === "P2").length
    };
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const invokedDirectly = process.argv[1]?.replaceAll("\\", "/").endsWith("/audit-placeholders.mjs");
if (invokedDirectly) {
  const report = await auditPlaceholders();
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 2);
}
