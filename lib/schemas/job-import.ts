import { z } from "zod";

export const importedJobRowSchema = z.object({
  title: z.string().min(5, "Titulo obrigatorio."),
  slug: z.string().optional().default(""),
  companyName: z.string().min(2, "Empresa obrigatoria."),
  cityName: z.string().min(2, "Cidade obrigatoria."),
  stateName: z.string().min(2, "Estado obrigatorio."),
  summary: z.string().min(20, "Resumo obrigatorio."),
  descriptionHtml: z.string().min(40, "Descricao obrigatoria."),
  requirementsText: z.string().min(5, "Requisitos obrigatorios."),
  benefitsText: z.string().optional().default(""),
  salaryMin: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().nullable().optional()),
  salaryMax: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().nullable().optional()),
  employmentType: z.enum(["APPRENTICESHIP", "INTERNSHIP", "TEMPORARY", "PART_TIME", "FULL_TIME"]).default("APPRENTICESHIP"),
  workHours: z.string().optional().default(""),
  publishedAt: z.string().optional().default(""),
  expiresAt: z.string().optional().default(""),
  validThrough: z.string().optional().default(""),
  applyUrl: z.string().url("URL de candidatura invalida."),
  isActive: z.boolean().default(true),
  sourceName: z.string().optional().default(""),
  sourceUrl: z.string().optional().default(""),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).default("ONSITE"),
  seoTitle: z.string().min(10, "SEO title obrigatorio."),
  seoDescription: z.string().min(20, "SEO description obrigatoria."),
  featured: z.boolean().default(false),
  externalId: z.string().optional().default("")
});

export const importJobsPayloadSchema = z.object({
  rows: z.array(importedJobRowSchema)
});

export type ImportedJobRow = z.infer<typeof importedJobRowSchema>;
