import { z } from "zod";

export const adSettingsPatchSchema = z.object({
  globalEnabled: z.boolean()
});

export const adSlotPatchSchema = z.object({
  code: z.string().optional(),
  adsenseSlotId: z.string().max(32).nullable().optional(),
  isActive: z.boolean().optional(),
  notes: z.string().max(2000).nullable().optional()
});
