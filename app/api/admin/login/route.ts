import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AuditAction } from "@prisma/client";


import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { ADMIN_AUTH_COOKIE, createAdminSessionToken, verifyPassword } from "@/lib/auth";
import { getSiteOrigin } from "@/lib/site-url";
import { adminLoginSchema } from "@/lib/schemas/admin-auth";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function POST(request: Request) {
  try {
    const body = adminLoginSchema.parse(await request.json());
    const loginInput = body.login_user.trim();
    const normalizedEmail = loginInput.toLowerCase();
    const isEmailLogin = normalizedEmail.includes("@");

    const user = await prisma.adminUser.findFirst({
      where: isEmailLogin
        ? { email: normalizedEmail }
        : {
            OR: [{ name: { equals: loginInput, mode: "insensitive" } }, { email: normalizedEmail }]
          }
    });

    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "login-debug",
        hypothesisId: "H4_LOGIN_IDENTIFIER_MODE",
        location: "app/api/admin/login/route.ts:POST",
        message: "Tentativa de login processada",
        data: {
          isEmailLogin,
          loginLength: loginInput.length,
          userFound: Boolean(user),
          userActive: user?.isActive ?? null
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion

    if (!user || !user.isActive) {
      return NextResponse.json({ ok: false, error: "Credenciais invalidas." }, { status: 401 });
    }

    const isValid = await verifyPassword(body.secret_key, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ ok: false, error: "Credenciais invalidas." }, { status: 401 });
    }

    const token = await createAdminSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: getSiteOrigin().startsWith("https://"),
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      priority: "high"
    });

    await writeAuditLog({
      actorId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      actorRole: user.role,
      action: AuditAction.LOGIN,
      entityType: "admin_session",
      entityId: user.id,
      entityLabel: user.email,
      summary: "Login realizado no painel"
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel entrar.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
