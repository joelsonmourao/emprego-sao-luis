#!/usr/bin/env node
/**
 * Arquiva vagas lixo óbvias (títulos de teste). Fail-closed fora de staging/e2e
 * a menos que ARCHIVE_JUNK_ALLOW_PRODUCTION=1 e confirmação explícita.
 *
 * node scripts/archive-junk-jobs.mjs --dry-run
 * node scripts/archive-junk-jobs.mjs --write
 */
import postgres from "postgres";

const write = process.argv.includes("--write");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL é obrigatória.");
  process.exit(1);
}

function describeDbUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: parsed.port || "(default)",
    database: parsed.pathname.replace(/^\//, ""),
    user: parsed.username || "(none)"
  };
}

const target = describeDbUrl(databaseUrl);
console.log(JSON.stringify({ target, passwordPrinted: false }, null, 2));

const looksLocal =
  (target.host === "127.0.0.1" || target.host === "localhost") &&
  (String(target.port) === "55432" || /staging|e2e/i.test(target.database));
const allowProd = process.env.ARCHIVE_JUNK_ALLOW_PRODUCTION === "1";

if (/coolify|empregossaoluis\.com\.br/i.test(databaseUrl) && !allowProd) {
  console.error("Recusa: DATABASE_URL parece produção/Coolify. Defina ARCHIVE_JUNK_ALLOW_PRODUCTION=1 após backup.");
  process.exit(1);
}

if (!looksLocal && !allowProd) {
  console.error("Recusa fail-closed: use banco E2E local ou ARCHIVE_JUNK_ALLOW_PRODUCTION=1.");
  process.exit(1);
}

const patterns = ["sqsqs", "teste", "test job", "asdf", "xxx"];
const sql = postgres(databaseUrl, { max: 1, prepare: false });

try {
  const rows = await sql`
    SELECT id, original_title, slug, publication_status
    FROM es_jobs
    WHERE publication_status IN ('PUBLISHED', 'DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED')
      AND (
        lower(original_title) ~ '^(sqsqs|teste|test|asdf|xxx)$'
        OR lower(original_title) LIKE 'teste %'
        OR lower(slug) LIKE '%sqsqs%'
      )
    ORDER BY updated_at DESC
    LIMIT 50
  `;

  console.log(
    JSON.stringify(
      { dryRun: !write, matched: rows.length, titles: rows.map((r) => r.original_title) },
      null,
      2
    )
  );

  if (!write) {
    console.log("Dry-run. Passe --write para arquivar.");
    process.exit(0);
  }

  if (!rows.length) {
    console.log(JSON.stringify({ ok: true, archived: 0 }));
    process.exit(0);
  }

  const ids = rows.map((r) => r.id);
  await sql`
    UPDATE es_jobs
    SET publication_status = 'ARCHIVED', updated_at = NOW()
    WHERE id = ANY(${ids}::uuid[])
  `;
  console.log(JSON.stringify({ ok: true, archived: ids.length, patterns }, null, 2));
} finally {
  await sql.end({ timeout: 5 });
}
