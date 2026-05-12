import { z } from "zod";

export const importedJobRowSchema = z.object({
  title: z.string().min(5, "Titulo obrigatorio."),
  slug: z.preprocess((value) => (value === null || value === undefined ? "" : String(value)), z.string()).optional().default(""),
  companyName: z.string().min(2, "Empresa obrigatoria."),
  cityName: z.string().min(2, "Cidade obrigatoria."),
  stateName: z.string().min(2, "Estado obrigatorio."),
  summary: z.string().min(20, "Resumo obrigatorio."),
  descriptionHtml: z.string().min(40, "Descricao obrigatoria."),
  requirementsText: z.string().optional().default(""),
  benefitsText: z.string().optional().default(""),
  area: z.string().optional().default(""),
  salaryMin: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().nullable().optional()),
  salaryMax: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().nullable().optional()),
  employmentType: z.string().optional().default(""),
  workHours: z.string().optional().default(""),
  publishedAt: z.string().optional().default(""),
  expiresAt: z.string().optional().default(""),
  validThrough: z.string().optional().default(""),
  validThroughMonths: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
  applyUrl: z.string().url("URL de candidatura invalida."),
  isActive: z.boolean().default(true),
  sourceName: z.string().optional().default(""),
  sourceUrl: z.string().optional().default(""),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]).default("ONSITE"),
  seoTitle: z.string().optional().default(""),
  seoDescription: z.string().optional().default(""),
  featured: z.boolean().default(false),
  externalId: z.string().optional().default("")
});

export const importJobsPayloadSchema = z.object({
  rows: z.array(importedJobRowSchema),
  useAi: z.boolean().optional().default(false),
  /**
   * Quando true, vagas já existentes (externalId/slug) recebem título, SEO title, jobTitle e JSON de
   * requisitos/benefícios conforme a planilha — comportamento padrão continua preservando título/seoTitle antigos.
   */
  reprocessExistingContent: z.boolean().optional().default(false)
});

export type ImportedJobRow = z.infer<typeof importedJobRowSchema>;
