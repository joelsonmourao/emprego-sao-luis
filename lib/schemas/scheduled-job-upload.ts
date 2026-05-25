import { z } from "zod";

const optionalString = z.preprocess((value) => (value === null || value === undefined ? "" : String(value).trim()), z.string());

export const scheduledJobUploadRowSchema = z.object({
  title: optionalString.optional().default(""),
  slug: optionalString.optional().default(""),
  companyName: optionalString.optional().default(""),
  cityName: z.preprocess((value) => (value === null || value === undefined ? "" : String(value).trim()), z.string().min(2, "Cidade obrigatoria.")),
  stateName: z.preprocess((value) => (value === null || value === undefined ? "" : String(value).trim()), z.string().min(2, "Estado obrigatorio.")),
  summary: optionalString.optional().default(""),
  descriptionHtml: z.preprocess(
    (value) => (value === null || value === undefined ? "" : String(value).trim()),
    z.string().min(1, "Descricao obrigatoria.")
  ),
  requirementsText: optionalString.optional().default(""),
  benefitsText: optionalString.optional().default(""),
  area: optionalString.optional().default(""),
  salaryMin: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  salaryMax: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  employmentType: optionalString.optional().default(""),
  workHours: optionalString.optional().default(""),
  expiresAt: optionalString.optional().default(""),
  validThrough: optionalString.optional().default(""),
  validThroughMonths: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return Number.isFinite(num) ? num : null;
  }, z.number().nullable().optional()),
  applyUrl: z.preprocess((value) => (value === null || value === undefined ? "" : String(value).trim()), z.string().url("URL de candidatura invalida.")),
  sourceName: optionalString.optional().default(""),
  sourceUrl: optionalString.optional().default(""),
  locationType: z.preprocess(
    (value) => (value === null || value === undefined ? "ONSITE" : String(value).trim().toUpperCase()),
    z.enum(["ONSITE", "REMOTE", "HYBRID"]).default("ONSITE")
  ),
  seoTitle: z.preprocess(
    (value) => (value === null || value === undefined ? "" : String(value).trim()),
    z.string().min(1, "seoTitle obrigatorio.")
  ),
  seoDescription: z.preprocess(
    (value) => (value === null || value === undefined ? "" : String(value).trim()),
    z.string().min(1, "seoDescription obrigatorio.")
  ),
  featured: z.boolean().optional().default(false),
  externalId: optionalString.optional().default(""),
  dataHoraPublicacao: z.union([z.string(), z.number(), z.date()]).optional().nullable()
});

export const scheduledJobUploadPayloadSchema = z.object({
  rows: z.array(scheduledJobUploadRowSchema).min(1, "Envie ao menos uma linha.")
});

export type ScheduledJobUploadRow = z.infer<typeof scheduledJobUploadRowSchema>;
