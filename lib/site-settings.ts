import { prisma } from "@/lib/db";
import { deepMergeDefaults } from "@/lib/merge-defaults";
import { defaultSiteSettings, siteSettingsSchema, type SiteSettings } from "@/lib/schemas/site-admin";

export { defaultSiteSettings, siteSettingsSchema };
export type { SiteSettings };

export async function getSiteSettings(): Promise<SiteSettings> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: "site_settings" }
  });

  if (!setting) {
    return defaultSiteSettings;
  }

  const parsed = siteSettingsSchema.safeParse(deepMergeDefaults(defaultSiteSettings, setting.value));
  return parsed.success ? parsed.data : defaultSiteSettings;
}
