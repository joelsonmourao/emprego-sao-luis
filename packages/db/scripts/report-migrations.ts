import { readFile } from "node:fs/promises";
import { createDatabase } from "../src/index.js";
import { sql } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL não configurada.");

const journalUrl = new URL("../migrations/meta/_journal.json", import.meta.url);
const journal = JSON.parse(await readFile(journalUrl, "utf8")) as { entries: Array<{ idx: number; tag: string; when: number }> };
const connection = createDatabase(databaseUrl);
try {
  const applied = await connection.db.execute(sql<{ created_at: string }>`select created_at::text from drizzle.__drizzle_migrations order by created_at`);
  const timestamps = new Set(applied.map((row) => Number(row.created_at)));
  const migrations = journal.entries.map((entry) => ({ index: entry.idx, migration: entry.tag, applied: timestamps.has(entry.when) }));
  const missing = migrations.filter((entry) => !entry.applied);
  console.log(JSON.stringify({ event: "database.migrations", applied: migrations.length - missing.length, total: migrations.length, migrations }, null, 2));
  if (missing.length) throw new Error(`Migrations pendentes: ${missing.map((entry) => entry.migration).join(", ")}`);
} finally {
  await connection.close();
}
