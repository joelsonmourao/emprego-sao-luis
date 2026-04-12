import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(2, "Informe o nome da empresa."),
  slug: z.string().min(2, "Informe o slug da empresa."),
  logoUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  websiteUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  socialImageUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  stateSlug: z.string().min(2, "Selecione o estado."),
  citySlug: z.string().min(2, "Selecione a cidade."),
  summary: z.string().min(20, "Escreva um resumo curto mais completo."),
  descriptionHtml: z.string().min(40, "Adicione uma descricao melhor para a empresa.").optional().default(""),
  seoTitle: z.string().min(10, "Defina um title melhor para a empresa.").optional().default(""),
  seoDescription: z.string().min(30, "Defina uma description melhor para a empresa.").optional().default(""),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export type CompanyFormInput = z.input<typeof companyFormSchema>;
export type CompanyFormValues = z.infer<typeof companyFormSchema>;

export const companyFormDefaults: CompanyFormValues = {
  name: "",
  slug: "",
  logoUrl: "",
  websiteUrl: "",
  socialImageUrl: "",
  stateSlug: "",
  citySlug: "",
  summary: "",
  descriptionHtml: "",
  seoTitle: "",
  seoDescription: "",
  featured: false,
  isActive: true
};
