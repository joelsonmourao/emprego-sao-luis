import { z } from "zod";

export const jobSearchParamsSchema = z.object({
  q: z.string().trim().optional(),
  estado: z.string().trim().optional(),
  cidade: z.string().trim().optional(),
  empresa: z.string().trim().optional(),
  order: z.enum(["relevance", "date"]).default("relevance"),
  page: z.coerce.number().int().min(1).default(1)
});

export type JobSearchParams = z.infer<typeof jobSearchParamsSchema>;
