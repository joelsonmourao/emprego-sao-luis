import type { APIRoute } from "astro";
import { createDatabase } from "@es/db";
import { sql } from "drizzle-orm";
import { createImportQueue } from "../../lib/queue";

export const GET: APIRoute = async () => {
  const checks: Record<string, string> = {}; let ok = true;
  if (!process.env.DATABASE_URL) { checks.database = "missing"; checks.schema = "unknown"; ok = false; } else { const connection = createDatabase(process.env.DATABASE_URL); try { await connection.db.execute(sql`select 1`); checks.database = "ok"; const [schema] = await connection.db.execute(sql<{ jobs: string | null; migrations: string | null }>`select to_regclass('public.es_jobs')::text as jobs, to_regclass('drizzle.__drizzle_migrations')::text as migrations`); checks.schema = schema?.jobs && schema.migrations ? "ok" : "migrations_required"; if (checks.schema !== "ok") ok = false; } catch { checks.database = "error"; checks.schema = "error"; ok = false; } finally { await connection.close(); } }
  try { const queue = createImportQueue(); try { await queue.getJobCounts("waiting"); checks.redis = "ok"; } finally { await queue.close(); } } catch { checks.redis = "error"; ok = false; }
  return Response.json({ ok, service: "web", status: ok ? "ready" : "not_ready", checks }, { status: ok ? 200 : 503 });
};
