import type { APIRoute } from "astro";
import { createCommercialOrder } from "../../../lib/commercial";
import { z } from "zod";

const schema = z.object({
  planSlug: z.string().min(1),
  companyName: z.string().trim().min(2).max(180),
  contactName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  whatsapp: z.string().trim().max(40).optional(),
  cnpj: z.string().trim().max(20).optional(),
  city: z.string().trim().min(2).max(120),
  termsAccepted: z.literal("1")
});

export const POST: APIRoute = async ({ request, redirect }) => {
  const { getEditorialPortalMode } = await import("../../../lib/portal-modes");
  const portal = await getEditorialPortalMode();
  if (portal.enabled) return redirect("/quadro-pausado", 303);
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) return redirect("/publicar-vaga?error=invalido", 303);
  try {
    const result = await createCommercialOrder({
      planSlug: parsed.data.planSlug,
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName,
      email: parsed.data.email,
      city: parsed.data.city,
      termsAccepted: true,
      ...(parsed.data.whatsapp ? { whatsapp: parsed.data.whatsapp } : {}),
      ...(parsed.data.cnpj ? { cnpj: parsed.data.cnpj } : {})
    });
    if (!result.order) return redirect("/publicar-vaga?error=indisponivel", 303);
    return redirect(`/publicar-vaga/resumo/${result.order.orderCode}`, 303);
  } catch {
    return redirect("/publicar-vaga?error=indisponivel", 303);
  }
};
