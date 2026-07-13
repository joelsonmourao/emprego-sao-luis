import type { APIRoute } from "astro";
import { z } from "zod";
import { adminPasswordSchema, zEmail } from "@es/shared";
import { ADMIN_COOKIE, authenticate } from "../../../lib/auth";
import { logAdminAuthFailure } from "../../../lib/admin-auth-log";
import { logServerError } from "../../../lib/server-error";

const otpSchema = z.union([z.literal(""), z.string().regex(/^\d{6}$/)]);

const schema = z.object({
  email: zEmail(),
  password: adminPasswordSchema(),
  otp: otpSchema.optional().default(""),
  next: z
    .string()
    .startsWith("/")
    .optional()
    .refine((value) => !value || value.startsWith("/admin"), { message: "Destino inválido." })
});

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "application/json" }
  });

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) {
    const passwordIssue = parsed.error.issues.find((issue) => issue.path[0] === "password");
    return Response.json(
      { ok: false, error: passwordIssue?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  let result;
  try {
    result = await authenticate(
      parsed.data.email,
      parsed.data.password,
      clientAddress,
      request.headers.get("user-agent") ?? "unknown",
      parsed.data.otp || undefined
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("AUTH_SECRET")) {
      logAdminAuthFailure("auth_secret_missing");
    } else if (message.includes("DATABASE_URL")) {
      logAdminAuthFailure("database_unavailable");
    } else {
      logServerError("route:/api/admin/login", error);
    }
    return Response.json({ ok: false, error: "Serviço de autenticação temporariamente indisponível." }, { status: 503 });
  }

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

  return Response.json({ ok: true, redirect: parsed.data.next ?? "/admin" });
};
