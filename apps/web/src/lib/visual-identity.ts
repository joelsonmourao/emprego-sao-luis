import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";

export interface VisualIdentity {
  siteName: string;
  primaryColor: string;
  logoUrl: string;
  iconUrl: string;
  tagline: string;
}

const defaults: VisualIdentity = {
  siteName: "Empregos São Luís",
  primaryColor: "#b42318",
  logoUrl: "",
  iconUrl: "",
  tagline: "Vagas verificadas em São Luís e no Maranhão"
};

export async function getVisualIdentity(): Promise<VisualIdentity> {
  if (!process.env.DATABASE_URL) return defaults;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, "visual_identity")).limit(1);
    if (!row?.value || typeof row.value !== "object") return defaults;
    return { ...defaults, ...(row.value as Partial<VisualIdentity>) };
  } catch {
    return defaults;
  } finally {
    await connection.close();
  }
}
