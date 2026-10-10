import type { APIRoute } from "astro";
import { getStorageObject, guessStorageContentType, StorageError } from "@es/storage";

export const GET: APIRoute = async ({ params }) => {
  const storageKey = params.path ?? "";
  if (!storageKey) return new Response("Not found", { status: 404 });
  if (!storageKey.startsWith("media/") && !storageKey.startsWith("brand/")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const body = await getStorageObject(storageKey);
    return new Response(body, {
      headers: {
        "content-type": guessStorageContentType(storageKey),
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff"
      }
    });
  } catch (error) {
    const status = error instanceof StorageError && error.code === "STORAGE_INVALID_KEY" ? 400 : 404;
    return new Response(status === 400 ? "Invalid path" : "Not found", { status });
  }
};
