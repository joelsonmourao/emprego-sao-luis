import { z } from "zod";

import { importedJobRowSchema } from "@/lib/schemas/job-import";

/**
 * Mesmas colunas da importacao padrao + `scheduledAt` obrigatorio (data/hora em Brasilia).
 */
export const scheduledJobUploadRowSchema = importedJobRowSchema
  .omit({ isActive: true, publishedAt: true })
  .extend({
    scheduledAt: z.union([z.string(), z.number()], {
      errorMap: () => ({ message: "scheduledAt obrigatorio (data e hora da publicacao em Brasilia)." })
    })
  });

export const scheduledJobUploadPayloadSchema = z.object({
  rows: z.array(scheduledJobUploadRowSchema).min(1, "Envie ao menos uma linha.")
});

export type ScheduledJobUploadRow = z.infer<typeof scheduledJobUploadRowSchema>;
