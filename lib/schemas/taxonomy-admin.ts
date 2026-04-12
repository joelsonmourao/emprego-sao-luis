import { z } from "zod";

export const taxonomyResourceSchema = z.enum(["states", "cities"]);

export const stateAdminSchema = z.object({
  name: z.string().min(2, "Informe o nome do estado."),
  code: z.string().min(2, "Informe a sigla do estado.").max(2, "Use apenas a sigla com 2 letras."),
  slug: z.string().min(2, "Informe o slug do estado."),
  seoTitle: z.string().optional().default(""),
  seoIntro: z.string().optional().default("")
});

export const cityAdminSchema = z.object({
  stateId: z.string().min(1, "Selecione o estado."),
  name: z.string().min(2, "Informe o nome da cidade."),
  slug: z.string().min(2, "Informe o slug da cidade."),
  seoTitle: z.string().optional().default(""),
  seoIntro: z.string().optional().default("")
});

export type TaxonomyResource = z.infer<typeof taxonomyResourceSchema>;
export type StateAdminInput = z.input<typeof stateAdminSchema>;
export type CityAdminInput = z.input<typeof cityAdminSchema>;
