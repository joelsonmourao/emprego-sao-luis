import type { APIRoute } from "astro";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { auditLogs, companyAccounts, createDatabase } from "@es/db";
import { COMPANY_COOKIE, authenticateCompany } from "../../../lib/company-auth";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  confirm: z.string().min(8)
});

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export const POST: APIRoute = async ({ request, cookies, clientAddress, redirect }) => {
  const form = Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(form);
  if (!parsed.success) return Response.json({ ok: false, error: "Dados inválidos." }, { status: 400 });
  if (parsed.data.password !== parsed.data.confirm) {
    return Response.json({ ok: false, error: "As senhas não coincidem." }, { status: 400 });
  }
  if (!process.env.DATABASE_URL) return Response.json({ ok: false, error: "Serviço indisponível." }, { status: 503 });

  const connection = createDatabase(process.env.DATABASE_URL);
  let email = "";
  try {
    const [account] = await connection.db
      .select()
      .from(companyAccounts)
      .where(
        and(
          eq(companyAccounts.inviteTokenHash, hash(parsed.data.token)),
          gt(companyAccounts.inviteExpiresAt, new Date()),
          eq(companyAccounts.active, true),
          isNull(companyAccounts.passwordHash)
        )
      )
      .limit(1);

    if (!account) return Response.json({ ok: false, error: "Convite inválido ou expirado." }, { status: 400 });

    email = account.email;
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await connection.db
      .update(companyAccounts)
      .set({
        passwordHash,
        inviteTokenHash: null,
        inviteExpiresAt: null,
        emailVerifiedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(companyAccounts.id, account.id));

    await connection.db.insert(auditLogs).values({
      action: "COMPANY_INVITE_ACCEPTED",
      entityType: "COMPANY_ACCOUNT",
      entityId: account.id,
      origin: "COMPANY_INVITE"
    });
  } finally {
    await connection.close();
  }

  const result = await authenticateCompany(email, parsed.data.password, clientAddress);
  if (result.ok) {
    cookies.set(COMPANY_COOKIE, result.token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "strict",
      path: "/",
      expires: result.expiresAt
    });
    return redirect("/empresa/dashboard", 303);
  }

  return redirect("/empresa/login?activated=1", 303);
};
