import type { APIRoute } from "astro";
import { auditLogs, createDatabase, indexingEvents, jobs } from "@es/db";
import { and, inArray } from "drizzle-orm";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { buildPublishIndexingEvents, buildRemoveIndexingEvents, type IndexingNotification } from "../../../../lib/indexing";

const statusSchema = z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "PAUSED", "ARCHIVED", "CLOSED", "EXPIRED"]);
export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "jobs.publish")) return new Response("Proibido", { status: 403 });
  const form = await request.formData();
  const ids = z.array(z.string().uuid()).min(1).max(200).safeParse(form.getAll("jobId"));
  const status = statusSchema.safeParse(form.get("status"));
  if (!ids.success || !status.success || !process.env.DATABASE_URL) return new Response("Selecione vagas e uma ação válida.", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.transaction(async (tx) => {
      const before = await tx.select().from(jobs).where(inArray(jobs.id, ids.data));
      if (before.length !== ids.data.length) throw new Error("Uma ou mais vagas não foram encontradas.");
      const now = new Date();
      const changed = await tx.update(jobs).set({ publicationStatus: status.data, publishedAt: status.data === "PUBLISHED" ? now : undefined, closedAt: ["ARCHIVED", "CLOSED", "EXPIRED"].includes(status.data) ? now : null, updatedAt: now }).where(and(inArray(jobs.id, ids.data))).returning({ id: jobs.id, slug: jobs.slug, version: jobs.version });
      const indexingRows: IndexingNotification[] = [];
      for (const item of changed) {
        if (status.data === "PUBLISHED") indexingRows.push(...buildPublishIndexingEvents({ id: item.id, slug: item.slug, version: item.version, prefix: "bulk-publish" }));
        else if (["ARCHIVED", "CLOSED", "EXPIRED"].includes(status.data)) indexingRows.push(...buildRemoveIndexingEvents({ id: item.id, slug: item.slug, prefix: `bulk-${status.data.toLowerCase()}` }));
      }
      if (indexingRows.length) await tx.insert(indexingEvents).values(indexingRows).onConflictDoNothing();
      await tx.insert(auditLogs).values({ actorId: auth.id, action: `BULK_JOB_STATUS_${status.data}`, entityType: "JOB", after: { ids: changed.map((item) => item.id), count: changed.length, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    });
    return redirect(`/admin/vagas?bulk=${status.data}`, 303);
  } finally {
    await connection.close();
  }
};
