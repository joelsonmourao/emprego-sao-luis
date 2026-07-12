import type { APIRoute } from "astro";
import { createDatabase } from "@es/db";
import { sql } from "drizzle-orm";
import { createImportQueue } from "../../lib/queue";

export const GET: APIRoute = async () => {
  const checks: Record<string, string> = {}; let ok = true;
  if (!process.env.DATABASE_URL) { checks.database = "missing"; ok = false; } else { const connection = createDatabase(process.env.DATABASE_URL); try { await connection.db.execute(sql`select 1`); checks.database = "ok"; } catch { checks.database = "error"; ok = false; } finally { await connection.close(); } }
  try { const queue = createImportQueue(); try { await queue.getJobCounts("waiting"); checks.redis = "ok"; } finally { await queue.close(); } } catch { checks.redis = "error"; ok = false; }
  return Response.json({ ok, service: "web", status: ok ? "ready" : "not_ready", checks }, { status: ok ? 200 : 503 });
};
