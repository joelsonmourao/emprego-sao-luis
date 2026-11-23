import type { APIRoute } from "astro";
import { z } from "zod";
import { createCompanyTicket } from "../../../lib/company-dashboard";

const schema = z.object({
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(4000)
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const company = locals.company;
  if (!company) return Response.json({ ok: false, error: "Não autenticado." }, { status: 401 });

  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) return Response.json({ ok: false, error: "Dados inválidos." }, { status: 400 });

  await createCompanyTicket({
    accountId: company.id,
    companyId: company.companyId,
    subject: parsed.data.subject,
    message: parsed.data.message
  });

  return redirect("/empresa/suporte?created=1", 303);
};
