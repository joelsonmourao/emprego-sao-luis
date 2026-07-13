import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import type { APIRoute } from "astro";
import { auditLogs, createDatabase, passwordResetTokens, sessions, users } from "@es/db";
import { adminPasswordSchema } from "@es/shared";
import { and, eq, gt, isNull } from "drizzle-orm";
import { z } from "zod";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

const schema = z
  .object({
    token: z.string().min(32),
    password: adminPasswordSchema().max(128),
    confirmation: z.string()
  })
  .refine((data) => data.password === data.confirmation, {
    message: "As senhas não conferem.",
    path: ["confirmation"]
  });

async function parseBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return schema.safeParse(await request.json());
  }
  return schema.safeParse(Object.fromEntries(await request.formData()));
}

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "POST", "Content-Type": "application/json" }
  });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const parsed = await parseBody(request);
  if (!parsed.success || !process.env.DATABASE_URL) {
    const passwordIssue = parsed.success ? undefined : parsed.error.issues.find((issue) => issue.path[0] === "password");
    const confirmationIssue = parsed.success ? undefined : parsed.error.issues.find((issue) => issue.path[0] === "confirmation");
    return Response.json(
      { ok: false, error: passwordIssue?.message ?? confirmationIssue?.message ?? "Solicitação inválida." },
      { status: 400 }
    );
  }

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [record] = await connection.db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, hash(parsed.data.token)),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    if (!record) {
      return Response.json({ ok: false, error: "Link inválido ou expirado." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await connection.db.transaction(async (tx) => {
      const claimed = await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(and(eq(passwordResetTokens.id, record.id), isNull(passwordResetTokens.usedAt)))
        .returning();
      if (!claimed.length) throw new Error("Token já utilizado.");
      await tx.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, record.userId));
      await tx
        .update(sessions)
        .set({ revokedAt: new Date(), updatedAt: new Date() })
        .where(and(eq(sessions.userId, record.userId), isNull(sessions.revokedAt)));
      await tx.insert(auditLogs).values({
        actorId: record.userId,
        action: "PASSWORD_RESET",
        entityType: "USER",
        entityId: record.userId,
        after: {
          ipHash: hash(clientAddress || "unknown"),
          userAgentHash: hash(request.headers.get("user-agent") || "unknown")
        },
        origin: "PASSWORD_RESET"
      });
    });

    return Response.json({ ok: true, redirect: "/admin/login?status=senha-alterada" });
  } finally {
    await connection.close();
  }
};
