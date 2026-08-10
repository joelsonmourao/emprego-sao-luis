import { createHash } from "node:crypto";
import postgres from "postgres";

const sourceUrl = process.env.LEGACY_DATABASE_URL;
const targetUrl = process.env.DATABASE_URL;
if (!sourceUrl || !targetUrl) throw new Error("Defina LEGACY_DATABASE_URL e DATABASE_URL. Use bancos de staging.");
if (process.env.ALLOW_PRODUCTION_MIGRATION !== "true" && /prod|production/i.test(targetUrl)) throw new Error("Destino parece produção; migração bloqueada.");

const source = postgres(sourceUrl, { max: 1, prepare: false });
const target = postgres(targetUrl, { max: 1, prepare: false });
const report: Record<string, { source: number; target: number }> = {};

try {
  const legacyStates = await source`select id, code, name, slug, "createdAt", "updatedAt" from "State"`;
  for (const row of legacyStates) await target`insert into es_states (legacy_id, code, name, slug, created_at, updated_at) values (${row.id}, ${row.code}, ${row.name}, ${row.slug}, ${row.createdAt}, ${row.updatedAt}) on conflict (legacy_id) do update set code=excluded.code, name=excluded.name, slug=excluded.slug, updated_at=excluded.updated_at`;
  const [{ count: targetCount }] = await target`select count(*)::int as count from es_states`;
  report.states = { source: legacyStates.length, target: Number(targetCount) };
  const digest = createHash("sha256").update(JSON.stringify(report)).digest("hex");
  process.stdout.write(`${JSON.stringify({ ok: true, report, digest }, null, 2)}\n`);
} finally {
  await source.end(); await target.end();
}
