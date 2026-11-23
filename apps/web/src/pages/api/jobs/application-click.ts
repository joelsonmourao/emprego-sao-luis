import type { APIRoute } from "astro";
import { createDatabase, jobApplicationEvents } from "@es/db";

export const POST: APIRoute = async ({ request }) => {
  let body: { jobId?: string; channel?: string; placement?: string; action?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(null, { status: 204 });
  }
  const jobId = typeof body.jobId === "string" ? body.jobId : "";
  const channel = typeof body.channel === "string" ? body.channel.toUpperCase() : "";
  const action = typeof body.action === "string" ? body.action.toUpperCase() : "OPEN";
  const placement = typeof body.placement === "string" ? body.placement : null;
  if (!jobId || !["URL", "WHATSAPP", "EMAIL"].includes(channel)) return new Response(null, { status: 204 });
  if (!process.env.DATABASE_URL) return new Response(null, { status: 204 });
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    await connection.db.insert(jobApplicationEvents).values({
      jobId,
      channel,
      action,
      placement,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null
    });
  } catch {
    // Never block candidacy UX on analytics failures.
  } finally {
    await connection.close();
  }
  return new Response(null, { status: 204 });
};
