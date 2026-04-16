import { z } from "zod";

export const jobFormSchema = z.object({
  title: z.string().min(5, "Informe o titulo da vaga."),
  slug: z.string().min(5, "Informe o slug."),
  companyId: z.string().min(1, "Selecione a empresa."),
  heroImageUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  stateSlug: z.string().min(2, "Selecione o estado."),
  citySlug: z.string().min(2, "Selecione a cidade."),
  locationType: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  employmentType: z.enum(["APPRENTICESHIP", "INTERNSHIP", "TEMPORARY", "PART_TIME", "FULL_TIME"]),
  summary: z.string().min(30, "Escreva um resumo mais completo."),
  descriptionHtml: z.string().min(80, "Adicione a descricao completa."),
  requirementsText: z.string().min(10, "Liste os requisitos."),
  benefitsText: z.string().optional().default(""),
  salaryMin: z.coerce.number().int().nonnegative().nullable().optional(),
  salaryMax: z.coerce.number().int().nonnegative().nullable().optional(),
  workHours: z.string().optional().default(""),
  applyUrl: z.string().url("Informe uma URL valida."),
  expiresAt: z.string().optional().default(""),
  validThrough: z.string().optional().default(""),
  seoTitle: z.string().min(10, "Defina um title melhor para SEO."),
  seoDescription: z.string().min(30, "Defina uma description mais completa."),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export type JobFormInput = z.input<typeof jobFormSchema>;
export type JobFormValues = z.infer<typeof jobFormSchema>;

export const jobFormDefaults: JobFormValues = {
  title: "",
  slug: "",
  companyId: "",
  heroImageUrl: "",
  stateSlug: "",
  citySlug: "",
  locationType: "ONSITE",
  employmentType: "APPRENTICESHIP",
  summary: "",
  descriptionHtml: "",
  requirementsText: "",
  benefitsText: "",
  salaryMin: null,
  salaryMax: null,
  workHours: "",
  applyUrl: "",
  expiresAt: "",
  validThrough: "",
  seoTitle: "",
  seoDescription: "",
  featured: false,
  isActive: true
};
