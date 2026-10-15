import { z } from "zod";

const variantSchema = z.object({
  url: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  mimeType: z.string().min(1),
  storageKey: z.string().min(1)
});
const metadataSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  variants: z.record(z.string(), variantSchema)
});

export function validateNewsImageAsset(metadata: unknown) {
  const parsed = metadataSchema.safeParse(metadata);
  if (!parsed.success)
    return { ok: false as const, error: "A imagem não possui metadados de processamento válidos." };
  if (parsed.data.width < 1200)
    return { ok: false as const, error: "A imagem principal precisa ter ao menos 1200 px de largura." };
  const required = ["hero", "card", "og", "square", "landscape43"];
  const missing = required.filter((key) => !parsed.data.variants[key]);
  if (missing.length) return { ok: false as const, error: `Variantes ausentes: ${missing.join(", ")}.` };
  return {
    ok: true as const,
    width: parsed.data.width,
    height: parsed.data.height,
    variants: parsed.data.variants,
    ogImageUrl: parsed.data.variants.og!.url
  };
}
