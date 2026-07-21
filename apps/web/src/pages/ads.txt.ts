import type { APIRoute } from "astro";
import { getSiteIntegrations, normalizePubIdForAdsTxt } from "../lib/site-integrations";

export const GET: APIRoute = async () => {
  const integrations = await getSiteIntegrations();
  const custom = integrations.adsTxtContent.trim();
  if (custom) {
    const body = custom.endsWith("\n") ? custom : `${custom}\n`;
    return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  const fromDb = normalizePubIdForAdsTxt(integrations.adsensePublisherId);
  const fromEnv = String(import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID ?? "").trim();
  const publisher =
    fromDb && /^pub-\d+$/i.test(fromDb)
      ? fromDb
      : fromEnv && /^pub-\d+$/i.test(fromEnv)
        ? fromEnv
        : normalizePubIdForAdsTxt(String(import.meta.env.PUBLIC_ADSENSE_CLIENT_ID ?? ""));

  const body =
    publisher && /^pub-\d+$/i.test(publisher)
      ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
      : "# AdSense ainda não ativado. Configure em /admin/integracoes\n";

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
