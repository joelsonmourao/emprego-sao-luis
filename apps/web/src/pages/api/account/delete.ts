import { createHash, randomUUID } from "node:crypto";
import type { APIRoute } from "astro";
import { candidateSessions, consentLogs, createDatabase, magicLinkTokens, savedJobs, userJobPreferences, userRoles, users } from "@es/db";
import { eq } from "drizzle-orm";
import { CANDIDATE_COOKIE } from "../../../lib/candidate-auth";

export const POST: APIRoute = async ({ request, locals, cookies, redirect, clientAddress }) => {
  const candidate = locals.candidate;
  const form = await request.formData();
  if (!candidate || form.get("confirmation") !== "EXCLUIR" || !process.env.DATABASE_URL) return new Response("Solicitação inválida", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [administrativeRole] = await connection.db.select({ roleId: userRoles.roleId }).from(userRoles).where(eq(userRoles.userId, candidate.id)).limit(1);
    if (administrativeRole) return new Response("Contas administrativas devem ser gerenciadas pelo painel.", { status: 403 });
    await connection.db.transaction(async (tx) => {
      await tx.delete(savedJobs).where(eq(savedJobs.userId, candidate.id));
      await tx.delete(userJobPreferences).where(eq(userJobPreferences.userId, candidate.id));
      await tx.delete(magicLinkTokens).where(eq(magicLinkTokens.userId, candidate.id));
      await tx.delete(candidateSessions).where(eq(candidateSessions.userId, candidate.id));
      await tx.update(users).set({ email: `deleted-${randomUUID()}@invalid.local`, name: "Conta excluída", active: false, passwordHash: null, updatedAt: new Date() }).where(eq(users.id, candidate.id));
      await tx.insert(consentLogs).values({ subjectHash: createHash("sha256").update(candidate.email).digest("hex"), purpose: "ACCOUNT", action: "DELETED", policyVersion: "2026-07-11", source: "SELF_SERVICE", ipHash: createHash("sha256").update(clientAddress || "unknown").digest("hex") });
    });
    cookies.delete(CANDIDATE_COOKIE, { path: "/" });
    return redirect("/?conta=excluida", 303);
  } finally { await connection.close(); }
};
