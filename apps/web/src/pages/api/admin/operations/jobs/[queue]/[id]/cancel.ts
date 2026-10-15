import type { APIRoute } from "astro";
import { auditLogs, createDatabase } from "@es/db";
import { z } from "zod";
import { can } from "../../../../../../../lib/auth";
import { QUEUE_NAMES, removeQueueJob, type QueueName } from "../../../../../../../lib/operations";

const schema = z.enum(QUEUE_NAMES);

export const POST: APIRoute = async ({ params, locals, redirect, clientAddress, request }) => {
  const auth = locals.auth!;
  if (!can(auth, "queues.manage")) return new Response("Proibido", { status: 403 });
  const queueName = schema.safeParse(params.queue);
  if (!queueName.success || !params.id) return new Response("Dados inválidos", { status: 400 });
  try {
    await removeQueueJob(queueName.data as QueueName, params.id);
    if (process.env.DATABASE_URL) {
      const connection = createDatabase(process.env.DATABASE_URL);
      try {
        await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "QUEUE_JOB_REMOVE", entityType: "QUEUE_JOB", entityId: params.id, after: { queue: queueName.data, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
      } finally {
        await connection.close();
      }
    }
    return redirect("/admin/operacao?removed=1", 303);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Falha ao remover job", { status: 409 });
  }
};
