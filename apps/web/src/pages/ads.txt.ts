import type { APIRoute } from "astro";
import { getSiteIntegrations, normalizePubIdForAdsTxt } from "../lib/site-integrations";
import { validateAdsTxtContent } from "../lib/ads-txt";

export const GET: APIRoute = async () => {
  const integrations = await getSiteIntegrations();
  const custom = integrations.adsTxtContent.trim();
  if (custom) {
    const normalized = validateAdsTxtContent(custom);
    if (normalized.valid && normalized.content) {
      return new Response(`${normalized.content}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
  }

  const fromDb = normalizePubIdForAdsTxt(integrations.adsensePublisherId);
  const fromEnv = String(process.env.PUBLIC_ADSENSE_PUBLISHER_ID ?? import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID ?? "").trim();
  const publisher =
    fromDb && /^pub-\d+$/i.test(fromDb)
      ? fromDb
      : fromEnv && /^pub-\d+$/i.test(fromEnv)
        ? fromEnv
        : normalizePubIdForAdsTxt(String(process.env.PUBLIC_ADSENSE_CLIENT_ID ?? import.meta.env.PUBLIC_ADSENSE_CLIENT_ID ?? ""));

  const body =
    publisher && /^pub-\d+$/i.test(publisher)
      ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
      : "# AdSense ainda não ativado. Configure em /admin/integracoes\n";

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
