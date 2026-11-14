import type { APIRoute } from "astro";
import { submitManualProof } from "../../../lib/commercial";
import { z } from "zod";

const schema = z.object({
  orderCode: z.string().min(4),
  proofUrl: z.string().trim().url().max(500)
});

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) {
    const code = String(form.orderCode ?? "");
    return redirect(code ? `/publicar-vaga/pedido/${code}?proof=invalido` : "/publicar-vaga", 303);
  }
  try {
    await submitManualProof(parsed.data.orderCode, parsed.data.proofUrl);
    return redirect(`/publicar-vaga/confirmacao/${parsed.data.orderCode}`, 303);
  } catch {
    return redirect(`/publicar-vaga/pedido/${parsed.data.orderCode}?proof=erro`, 303);
  }
};
