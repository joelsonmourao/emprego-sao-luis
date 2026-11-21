import type { APIRoute } from "astro";
import { initiateOrderPayment } from "../../../lib/commercial";
import { z } from "zod";

const schema = z.object({ orderCode: z.string().min(4) });

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) return redirect("/publicar-vaga", 303);
  const siteUrl = process.env.SITE_URL ?? "https://empregossaoluis.com.br";
  try {
    const result = await initiateOrderPayment(parsed.data.orderCode, siteUrl);
    if (result.status === "redirect") return redirect(result.checkoutUrl, 302);
    return redirect(`/publicar-vaga/pedido/${parsed.data.orderCode}?pay=indisponivel`, 303);
  } catch {
    return redirect(`/publicar-vaga/pedido/${parsed.data.orderCode}?pay=erro`, 303);
  }
};
