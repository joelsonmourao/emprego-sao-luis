import { createDatabase, settings } from "@es/db";
import { eq } from "drizzle-orm";
import { BRAND_ASSETS, BRAND_COLORS } from "./brand-assets";
import { getBrandIdentity, brandIdentityToVisualIdentity, invalidateBrandCache } from "./brand/identity-service";

export interface VisualIdentity {
  siteName: string;
  primaryColor: string;
  logoUrl: string;
  logoUrlDark: string;
  iconUrl: string;
  tagline: string;
  faviconUrl?: string;
  appleTouchIconUrl?: string;
  ogImageUrl?: string;
  themeColor?: string;
}

const defaults: VisualIdentity = {
  siteName: BRAND_ASSETS.siteName,
  primaryColor: BRAND_COLORS.brandPrimary,
  logoUrl: BRAND_ASSETS.logoHorizontalWebp,
  logoUrlDark: BRAND_ASSETS.logoHorizontalOnDarkWebp,
  iconUrl: BRAND_ASSETS.iconWebp,
  tagline: "Vagas SLZ e empregos verificados em São Luís e no Maranhão",
  faviconUrl: BRAND_ASSETS.faviconSvg,
  appleTouchIconUrl: BRAND_ASSETS.appleTouchIcon,
  ogImageUrl: `${process.env.SITE_URL ?? "https://empregossaoluis.com.br"}/brand/og-default.png`,
  themeColor: BRAND_ASSETS.themeColor
};

export async function getVisualIdentity(): Promise<VisualIdentity> {
  try {
    const brand = await getBrandIdentity();
    const mapped = brandIdentityToVisualIdentity(brand);
    return {
      ...defaults,
      ...mapped,
      ...(brand.assets["brand.favicon"]?.url ? { faviconUrl: brand.assets["brand.favicon"].url } : {}),
      ...(brand.assets["brand.appleTouchIcon"]?.url ? { appleTouchIconUrl: brand.assets["brand.appleTouchIcon"].url } : {}),
      ...(brand.assets["brand.ogDefault"]?.url ? { ogImageUrl: brand.assets["brand.ogDefault"].url } : {}),
      themeColor: brand.palette.themeColor
    };
  } catch {
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
}

export { invalidateBrandCache };
