import type { APIRoute } from "astro";
import { z } from "zod";
import { can } from "../../../../lib/auth";
import { applySafeEditorialFixes } from "../../../../lib/editorial-audit";
import { adminJsonError, adminJsonRedirect, adminMethodNotAllowed } from "../../../../lib/admin-api-response";

export const GET: APIRoute = () => adminMethodNotAllowed("POST");

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth;
  if (!auth || !can(auth, "content.manage")) {
    return adminJsonError("Sem permissão para aplicar correções editoriais.", 403);
  }
  const form = await request.formData();
  const confirm = String(form.get("confirm") ?? "");
  if (confirm !== "APPLY_SAFE_FIXES") {
    return adminJsonError("Confirmação obrigatória para aplicar correções seguras.", 422);
  }
  const ids = form.getAll("articleId").map(String).filter(Boolean);
  const parsedIds = z.array(z.string().uuid()).max(500).safeParse(ids);
  const result = await applySafeEditorialFixes(auth.id, parsedIds.success ? parsedIds.data : undefined);
  return adminJsonRedirect(
    `/admin/qualidade-editorial?success=autofix&applied=${result.totalApplied}&items=${result.results.length}`,
    {
      message: `Aplicadas ${result.totalApplied} correção(ões) segura(s) em ${result.results.length} conteúdo(s).`
    }
  );
};
