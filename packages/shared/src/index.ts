import { z } from "zod";

export const publicCodeSchema = z.string().regex(/^ES-\d{6}$/);

export const jobDraftSchema = z.object({
  originalTitle: z.string().trim().min(3).max(160),
  normalizedTitle: z.string().trim().min(3).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180),
  companyId: z.uuid(), cityId: z.uuid(), stateId: z.uuid(), categoryId: z.uuid().optional(),
  employmentType: z.string().trim().min(2).max(50),
  workplaceType: z.enum(["presencial", "hibrido", "remoto"]),
  summary: z.string().trim().min(40).max(500), description: z.string().trim().min(80),
  applicationUrl: z.url(), sourceName: z.string().trim().min(2).max(120), sourceUrl: z.url().optional(),
  expiresAt: z.coerce.date(), salaryMin: z.coerce.number().nonnegative().optional(), salaryMax: z.coerce.number().nonnegative().optional(),
  publicationStatus: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED"]).default("DRAFT")
}).superRefine((value, context) => {
  if (value.salaryMin !== undefined && value.salaryMax !== undefined && value.salaryMax < value.salaryMin) context.addIssue({ code: "custom", path: ["salaryMax"], message: "Salário máximo menor que o mínimo." });
  if (value.expiresAt <= new Date()) context.addIssue({ code: "custom", path: ["expiresAt"], message: "Validade deve estar no futuro." });
});

export type JobDraftInput = z.infer<typeof jobDraftSchema>;
