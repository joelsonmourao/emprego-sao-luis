import { z } from "zod";

import { importedJobRowSchema } from "@/lib/schemas/job-import";

/**
 * Mesmas colunas da importacao padrao + `dataHoraPublicacao`.
 */
export const scheduledJobUploadRowSchema = importedJobRowSchema
  .omit({ isActive: true, publishedAt: true })
  .extend({
    dataHoraPublicacao: z.union([z.string(), z.number(), z.date()]).optional().nullable()
  });

export const scheduledJobUploadPayloadSchema = z.object({
  rows: z.array(scheduledJobUploadRowSchema).min(1, "Envie ao menos uma linha.")
});

export type ScheduledJobUploadRow = z.infer<typeof scheduledJobUploadRowSchema>;
