import { cache } from "react";

import { prisma } from "@/lib/db";
import { deepMergeDefaults } from "@/lib/merge-defaults";
import { defaultSiteContent, siteContentSchema, type SiteContent, type SiteFaqEntry } from "@/lib/schemas/site-admin";

export { defaultSiteContent, siteContentSchema };
export type { SiteContent, SiteFaqEntry };

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "site_content" }
    });

    if (!setting) {
      return defaultSiteContent;
    }

    const parsed = siteContentSchema.safeParse(deepMergeDefaults(defaultSiteContent, setting.value));
    return parsed.success ? parsed.data : defaultSiteContent;
  } catch (error) {
    console.error("[site-content] Falha ao carregar conteudo do site. Usando defaults.", error);
    return defaultSiteContent;
  }
});
