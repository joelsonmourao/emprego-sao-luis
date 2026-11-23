import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { indexingIntegrationStatus } from "../../../../lib/indexing";

export const GET: APIRoute = async ({ locals }) => {
  if (!can(locals.auth!, "seo.manage")) return new Response("Proibido", { status: 403 });
  const status = indexingIntegrationStatus();
  return Response.json({
    ...status,
    notes: {
      google: status.google.configured ? (status.google.enabled ? "Pronto para envio" : "Desabilitado por GOOGLE_INDEXING_ENABLED=false") : "Configure GOOGLE_INDEXING_CLIENT_EMAIL e GOOGLE_INDEXING_PRIVATE_KEY no Coolify",
      indexNow: status.indexNow.configured ? "Pronto para envio" : "Configure INDEXNOW_KEY e SITE_URL no Coolify",
      meta: status.meta.configured ? "Pronto para publicação automática" : "Configure META_INSTAGRAM_ACCOUNT_ID e META_PAGE_ACCESS_TOKEN no Coolify"
    }
  });
};
