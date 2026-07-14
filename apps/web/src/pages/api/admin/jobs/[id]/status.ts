import type { APIRoute } from "astro";
import { auditLogs, createDatabase, indexingEvents, jobRevisions, jobs } from "@es/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../../lib/auth";
import { buildPublishIndexingEvents, buildRemoveIndexingEvents } from "../../../../../lib/indexing";

const schema = z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "PAUSED", "EXPIRED", "CLOSED", "ARCHIVED"]);
export const POST: APIRoute = async ({ params, request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "jobs.publish")) return new Response("Proibido", { status: 403 });
  const status = schema.safeParse((await request.formData()).get("status"));
  if (!params.id || !status.success || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const [before] = await tx.select().from(jobs).where(eq(jobs.id, params.id!)).limit(1);
      if (!before) throw new Error("Vaga não encontrada.");
      const now = new Date();
      const [after] = await tx.update(jobs).set({ publicationStatus: status.data, publishedAt: status.data === "PUBLISHED" ? before.publishedAt ?? now : before.publishedAt, closedAt: ["CLOSED", "ARCHIVED", "EXPIRED"].includes(status.data) ? now : null, version: before.version + 1, updatedAt: now }).where(and(eq(jobs.id, before.id), eq(jobs.version, before.version))).returning();
      if (!after) throw new Error("A vaga foi alterada por outra sessão. Recarregue a página.");
      await tx.insert(jobRevisions).values({ jobId: before.id, version: before.version, snapshot: before, actorId: auth.id }).onConflictDoNothing();
      await tx.insert(auditLogs).values({ actorId: auth.id, action: `JOB_STATUS_${status.data}`, entityType: "JOB", entityId: before.id, before, after: { record: after, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
      if (status.data === "PUBLISHED") await tx.insert(indexingEvents).values(buildPublishIndexingEvents({ id: after.id, slug: after.slug, version: after.version, prefix: "status" })).onConflictDoNothing();
      if (["CLOSED", "ARCHIVED", "EXPIRED"].includes(status.data)) await tx.insert(indexingEvents).values(buildRemoveIndexingEvents({ id: after.id, slug: after.slug, prefix: `status-${status.data.toLowerCase()}` })).onConflictDoNothing();
    });
    return redirect("/admin/vagas?updated=1", 303);
  } finally { await connection.close(); }
};
