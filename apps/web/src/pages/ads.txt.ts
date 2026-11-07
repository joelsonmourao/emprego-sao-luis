import type { APIRoute } from "astro";
import { normalizeGooglePublisherId, prepareAdsTxtContent } from "../lib/ads-txt";
import { getSiteIntegrations } from "../lib/site-integrations";

const textHeaders = { "content-type": "text/plain; charset=utf-8" };

export const GET: APIRoute = async () => {
  const integrations = await getSiteIntegrations();
  const custom = prepareAdsTxtContent(integrations.adsTxtContent);
  if (custom) {
    return new Response(custom, {
      status: 200,
      headers: {
        ...textHeaders,
        "cache-control": "public, max-age=300"
      }
    });
  }

  const publisher = [
    integrations.adsensePublisherId,
    String(import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID ?? ""),
    String(import.meta.env.PUBLIC_ADSENSE_CLIENT_ID ?? "")
  ]
    .map(normalizeGooglePublisherId)
    .find(Boolean);

  if (!publisher) {
    return new Response("", {
      status: 404,
      headers: {
        ...textHeaders,
        "cache-control": "no-store"
      }
    });
  }

  return new Response(
    `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`,
    {
      status: 200,
      headers: {
        ...textHeaders,
        "cache-control": "public, max-age=300"
      }
    }
  );
};
