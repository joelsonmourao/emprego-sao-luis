import type { APIRoute } from "astro";
import { getAutoEditorialStatus } from "../../../lib/auto-editorial";

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, ...getAutoEditorialStatus() }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0"
    }
  });
