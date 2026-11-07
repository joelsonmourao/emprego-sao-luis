import { zEmail } from "@es/shared";
import type { APIRoute } from "astro";
import { z } from "zod";
import { advertisers, auditLogs, createDatabase } from "@es/db";
import { can } from "../../../../lib/auth";

const schema = z.object({ name: z.string().min(2), contactEmail: zEmail(), document: z.string().optional() });

export const POST: APIRoute = async ({ request, locals, redirect, clientAddress }) => {
  const auth = locals.auth!;
  if (!can(auth, "commercial.manage")) return new Response("Proibido", { status: 403 });
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success || !process.env.DATABASE_URL) return new Response("Dados inválidos", { status: 400 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [row] = await connection.db.insert(advertisers).values(parsed.data).returning();
    await connection.db.insert(auditLogs).values({ actorId: auth.id, action: "ADVERTISER_CREATE", entityType: "ADVERTISER", entityId: row!.id, after: { record: row, ip: clientAddress, userAgent: request.headers.get("user-agent") }, origin: "ADMIN" });
    return redirect("/admin/publicidade?advertiser=1", 303);
  } finally {
    await connection.close();
  }
};
