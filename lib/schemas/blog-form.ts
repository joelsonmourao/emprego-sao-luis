import { z } from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(8, "Informe um titulo melhor."),
  slug: z.string().min(5, "Informe o slug."),
  categorySlug: z.string().min(2, "Informe a categoria."),
  excerpt: z.string().min(30, "Crie um resumo mais forte."),
  contentHtml: z.string().min(120, "Escreva o conteudo do post."),
  coverImageUrl: z.string().url("Informe uma URL valida.").optional().or(z.literal("")),
  seoTitle: z.string().min(10, "Defina um title melhor para SEO."),
  seoDescription: z.string().min(30, "Defina uma description mais forte."),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().optional().default("")
});

export type BlogFormInput = z.input<typeof blogFormSchema>;
export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const blogFormDefaults: BlogFormValues = {
  title: "",
  slug: "",
  categorySlug: "",
  excerpt: "",
  contentHtml: "",
  coverImageUrl: "",
  seoTitle: "",
  seoDescription: "",
  isPublished: true,
  publishedAt: ""
};
