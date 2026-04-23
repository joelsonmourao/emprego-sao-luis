import { z } from "zod";

export const adModeSchema = z.enum(["manual", "automatico", "hibrido"]);

export const adSettingsPatchSchema = z.object({
  globalEnabled: z.boolean().optional(),
  adMode: adModeSchema.optional()
});

export const adSlotPatchSchema = z.object({
  code: z.string().optional(),
  adsenseSlotId: z.string().max(32).nullable().optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(2000).nullable().optional()
});
