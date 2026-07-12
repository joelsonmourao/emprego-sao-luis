import type { APIRoute } from "astro";
import { z } from "zod";
import { COMPANY_COOKIE, authenticateCompany } from "../../../lib/company-auth";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
  next: z.string().startsWith("/").optional()
});

export const POST: APIRoute = async ({ request, cookies, clientAddress, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) return Response.json({ ok: false, error: "Dados inválidos." }, { status: 400 });

  const result = await authenticateCompany(parsed.data.email, parsed.data.password, clientAddress);
  if (!result.ok) return Response.json({ ok: false, error: "Credenciais inválidas." }, { status: 401 });

  cookies.set(COMPANY_COOKIE, result.token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    expires: result.expiresAt
  });

  const next = parsed.data.next?.startsWith("/empresa") ? parsed.data.next : "/empresa/dashboard";
  return redirect(next, 303);
};
