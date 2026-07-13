import type { APIRoute } from "astro";
import { z } from "zod";
import { adminPasswordSchema } from "@es/shared";
import { ADMIN_COOKIE, authenticate } from "../../../lib/auth";

const schema = z.object({
  email: z.email(),
  password: adminPasswordSchema(),
  otp: z.string().regex(/^\d{6}$/).optional().or(z.literal("")),
  next: z.string().startsWith("/").optional()
});

export const POST: APIRoute = async ({ request, cookies, clientAddress, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) {
    const passwordIssue = parsed.error.issues.find((issue) => issue.path[0] === "password");
    return Response.json(
      { ok: false, error: passwordIssue?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }
  const result = await authenticate(
    parsed.data.email,
    parsed.data.password,
    clientAddress,
    request.headers.get("user-agent") ?? "unknown",
    parsed.data.otp || undefined
  );
  if (!result.ok) {
    return Response.json(
      {
        ok: false,
        error:
          result.reason === "rate_limited"
            ? "Muitas tentativas. Aguarde 15 minutos."
            : result.reason === "mfa_required"
              ? "Informe o código de autenticação."
              : result.reason === "invalid_otp"
                ? "Código de autenticação inválido."
                : "Credenciais inválidas."
      },
      { status: result.reason === "rate_limited" ? 429 : 401 }
    );
  }
  cookies.set(ADMIN_COOKIE, result.token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    expires: result.expiresAt
  });
  return redirect(parsed.data.next ?? "/admin", 303);
};
