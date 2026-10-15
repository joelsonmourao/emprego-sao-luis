import type { APIRoute } from "astro";
import { and, eq, gt, isNull } from "drizzle-orm";
import { createDatabase, magicLinkTokens, users } from "@es/db";
import { CANDIDATE_COOKIE, candidateTokenHash, createCandidateSession } from "../lib/candidate-auth";

function safeNextPath(value: string | null) {
  const next = String(value || "").trim();
  return next.startsWith("/") && !next.startsWith("//") ? next : "/minha-conta";
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const token = url.searchParams.get("token");
  const nextPath = safeNextPath(url.searchParams.get("next"));
  if (!token || !process.env.DATABASE_URL) return redirect("/entrar?status=link-invalido", 302);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [record] = await connection.db
      .select({ magic: magicLinkTokens, user: users })
      .from(magicLinkTokens)
      .innerJoin(users, eq(magicLinkTokens.userId, users.id))
      .where(
        and(
          eq(magicLinkTokens.tokenHash, candidateTokenHash(token)),
          isNull(magicLinkTokens.usedAt),
          gt(magicLinkTokens.expiresAt, new Date()),
          eq(users.active, true)
        )
      )
      .limit(1);
    if (!record) return redirect("/entrar?status=link-invalido", 302);
    const claimed = await connection.db
      .update(magicLinkTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(magicLinkTokens.id, record.magic.id), isNull(magicLinkTokens.usedAt)))
      .returning({ id: magicLinkTokens.id });
    if (!claimed.length) return redirect("/entrar?status=link-usado", 302);
    await connection.db
      .update(users)
      .set({ emailVerifiedAt: record.user.emailVerifiedAt ?? new Date(), updatedAt: new Date() })
      .where(eq(users.id, record.user.id));
    const session = await createCandidateSession(record.user.id);
    cookies.set(CANDIDATE_COOKIE, session.token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt
    });
    return redirect(nextPath, 302);
  } finally {
    await connection.close();
  }
};
