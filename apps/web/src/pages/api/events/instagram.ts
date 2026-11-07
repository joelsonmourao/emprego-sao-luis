import type { APIRoute } from "astro";
import { createHash } from "node:crypto";
import { auditLogs, createDatabase } from "@es/db";
import { INSTAGRAM_TRACK_EVENTS } from "../../../lib/instagram-cta";
import { z } from "zod";

const schema = z.object({
  event: z.enum(INSTAGRAM_TRACK_EVENTS),
  path: z.string().max(500).optional()
});

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });

  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      await connection.db.insert(auditLogs).values({
        action: parsed.data.event,
        entityType: "INSTAGRAM_CTA",
        after: { path: parsed.data.path ?? null, ipHash: hash(clientAddress ?? "unknown") },
        origin: "PUBLIC"
      });
    } catch {
      // tracking must not block navigation
    } finally {
      await connection.close();
    }
  }

  return new Response(null, { status: 204 });
};
