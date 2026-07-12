import type { APIRoute } from "astro";
export const GET: APIRoute = ({ params }) => { const configured = process.env.INDEXNOW_KEY; if (!configured || params.indexnowKey !== configured) return new Response("Not found", { status: 404 }); return new Response(configured, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } }); };
