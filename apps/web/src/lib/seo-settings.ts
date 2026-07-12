import { eq } from "drizzle-orm";
import { createDatabase, settings } from "@es/db";
import { defaultSeoSettings, mergeSeoSettings, type SeoSettings } from "@es/seo";

const KEY = "seo_settings";

export async function getSeoSettings(): Promise<SeoSettings> {
  if (!process.env.DATABASE_URL) return defaultSeoSettings;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, KEY));
    return mergeSeoSettings(row?.value);
  } finally {
    await connection.close();
  }
}

export async function saveSeoSettings(value: SeoSettings) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(settings).values({ key: KEY, value, public: true }).onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
  } finally {
    await connection.close();
  }
}
