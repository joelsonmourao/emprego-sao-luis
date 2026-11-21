import type { APIRoute } from "astro";
import { can } from "../../../../lib/auth";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../lib/admin-api-response";
import { persistEditorialAudit } from "../../../../lib/editorial-audit";

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage"))
    return adminJsonError("Sem permissão para persistir a auditoria editorial.", 403);
  const result = await persistEditorialAudit(auth.id);
  return adminJsonRedirect("/admin/qualidade-editorial?success=auditoria-persistida", {
    message: `Auditoria persistida para ${result.total} conteúdo(s).`
  });
};
