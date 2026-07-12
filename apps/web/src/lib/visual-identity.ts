import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { BRAND_ASSETS, BRAND_COLORS } from "./brand-assets";

export interface VisualIdentity {
  siteName: string;
  primaryColor: string;
  logoUrl: string;
  logoUrlDark: string;
  iconUrl: string;
  tagline: string;
}

const defaults: VisualIdentity = {
  siteName: BRAND_ASSETS.siteName,
  primaryColor: BRAND_COLORS.brandPrimary,
  logoUrl: BRAND_ASSETS.logoHorizontalWebp,
  logoUrlDark: BRAND_ASSETS.logoHorizontalWebp,
  iconUrl: BRAND_ASSETS.iconWebp,
  tagline: "Vagas verificadas em São Luís e no Maranhão"
};

export async function getVisualIdentity(): Promise<VisualIdentity> {
  if (!process.env.DATABASE_URL) return defaults;
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.select().from(settings).where(eq(settings.key, "visual_identity")).limit(1);
    if (!row?.value || typeof row.value !== "object") return defaults;
    const stored = row.value as Partial<VisualIdentity>;
    return {
      ...defaults,
      ...stored,
      logoUrl: stored.logoUrl || defaults.logoUrl,
      logoUrlDark: stored.logoUrlDark || stored.logoUrl || defaults.logoUrlDark,
      iconUrl: stored.iconUrl || defaults.iconUrl
    };
  } catch {
    return defaults;
  } finally {
    await connection.close();
  }
}
