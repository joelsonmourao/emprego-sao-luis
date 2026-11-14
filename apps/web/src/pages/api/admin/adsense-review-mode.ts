import type { APIRoute } from "astro";
import { z } from "zod";
import { can } from "../../../lib/auth";
import { setAdsenseReviewMode } from "../../../lib/portal-modes";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../lib/admin-api-response";

const schema = z.object({ enabled: z.enum(["true", "false"]) });

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "seo.manage")) {
    return adminJsonError("Sem permissão para alterar o Modo de Revisão AdSense.", 403);
  }
  const parsed = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!parsed.success) return adminJsonError("Configuração inválida.", 422);
  const enabled = parsed.data.enabled === "true";
  const result = await setAdsenseReviewMode(enabled, auth.id);
  return adminJsonRedirect(`/admin/adsense-readiness?message=${encodeURIComponent(
    result.before === result.after
      ? `O Modo de Revisão AdSense já estava ${enabled ? "ativo" : "desativado"}.`
      : `Modo de Revisão AdSense ${enabled ? "ativado" : "desativado"}.`
  )}#configuracoes`);
};
