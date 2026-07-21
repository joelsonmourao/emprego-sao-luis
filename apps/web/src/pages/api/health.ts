import type { APIRoute } from "astro";
import { SITE_TIME_ZONE } from "@es/shared";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      ok: true,
      service: "web",
      status: "healthy",
      timeZone: SITE_TIME_ZONE,
      now: new Date().toISOString()
    }),
    {
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
    }
  );
