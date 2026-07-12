import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, service: "web", status: "healthy" }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
