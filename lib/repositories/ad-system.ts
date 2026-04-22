import { cache } from "react";

import { prisma } from "@/lib/db";

export const AD_SETTINGS_ID = "singleton";

export const getAdSettings = cache(async () => {
  const row = await prisma.adSettings.findUnique({ where: { id: AD_SETTINGS_ID } });
  if (!row) {
    return { id: AD_SETTINGS_ID, globalEnabled: true, updatedAt: new Date() };
  }
  return row;
});

export async function upsertAdSettings(globalEnabled: boolean) {
  return prisma.adSettings.upsert({
    where: { id: AD_SETTINGS_ID },
    create: { id: AD_SETTINGS_ID, globalEnabled },
    update: { globalEnabled }
  });
}

export const listAdSlots = cache(async () => {
  return prisma.adSlot.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
});

export async function updateAdSlotBySlug(
  slug: string,
  data: { code?: string; adsenseSlotId?: string | null; isActive?: boolean; notes?: string | null }
) {
  return prisma.adSlot.update({
    where: { slug },
    data: {
      ...(data.code !== undefined ? { code: data.code } : {}),
      ...(data.adsenseSlotId !== undefined ? { adsenseSlotId: data.adsenseSlotId } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {})
    }
  });
}
