import type { APIRoute } from "astro";
import { serveBrandAssetFile } from "../../../lib/brand/identity-service";

export const GET: APIRoute = async ({ params }) => {
  const storageKey = params.path ?? "";
  if (!storageKey || storageKey.includes("..")) return new Response("Not found", { status: 404 });
  const file = await serveBrandAssetFile(storageKey);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file.body, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff"
    }
  });
};
