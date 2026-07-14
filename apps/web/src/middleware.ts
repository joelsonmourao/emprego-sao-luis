import { and, eq } from "drizzle-orm";
import { createDatabase, redirects } from "@es/db";
import { defineMiddleware } from "astro:middleware";
import { storageStartup } from "./instrumentation";
import {
  adminJsonError,
  createRequestId,
  normalizeAdminApiResponse
} from "./lib/admin-api-response";
import { ADMIN_COOKIE, verifySession } from "./lib/auth";
import { CANDIDATE_COOKIE, verifyCandidateSession } from "./lib/candidate-auth";
import { COMPANY_COOKIE, verifyCompanySession } from "./lib/company-auth";
import { logServerError } from "./lib/server-error";
import { isJsonAuthApiPath, isTrustedApiOrigin } from "./lib/trusted-origin";

const CANONICAL_HOST = "empregossaoluis.com.br";
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/esqueci-senha", "/admin/redefinir-senha"]);

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.url.hostname.toLowerCase();
  if (host === `www.${CANONICAL_HOST}`) {
    const target = new URL(context.url);
    target.hostname = CANONICAL_HOST;
    target.protocol = "https:";
    return context.redirect(target.toString(), 301);
  }

  const path = context.url.pathname;
  const isAdminApi = path.startsWith("/api/admin");
  const requestId = isAdminApi ? createRequestId(context.request) : null;

  if (path.startsWith("/api/admin/imports") || path.startsWith("/api/admin/media") || path === "/admin/saude") {
    await storageStartup;
  }

  if (isJsonAuthApiPath(path) && !["GET", "HEAD", "OPTIONS"].includes(context.request.method)) {
    const origin = context.request.headers.get("origin");
    if (!isTrustedApiOrigin(origin, context.url.origin)) {
      const denied = isAdminApi
        ? await normalizeAdminApiResponse(
            adminJsonError("Origem da requisição não autorizada.", 403, { code: "ORIGIN_FORBIDDEN" }),
            requestId!
          )
        : Response.json({ ok: false, error: "Cross-site request forbidden." }, { status: 403 });
      denied.headers.set("X-ES-App", "astro");
      return denied;
    }
  }

  if (path === "/anunciar-vaga") return context.redirect("/publicar-vaga", 301);

  if (
    context.request.method === "GET" &&
    process.env.DATABASE_URL &&
    !path.startsWith("/api/") &&
    !path.startsWith("/admin") &&
    !path.startsWith("/empresa")
  ) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      const [rule] = await connection.db
        .select()
        .from(redirects)
        .where(and(eq(redirects.sourcePath, path), eq(redirects.active, true)))
        .limit(1);
      if (rule && rule.destinationPath !== path) {
        const status = ([301, 302, 303, 307, 308] as const).find((value) => value === rule.statusCode) ?? 301;
        return context.redirect(rule.destinationPath, status);
      }
    } catch (error) {
      logServerError(`middleware:redirects:${path}`, error);
    } finally {
      await connection.close();
    }
  }

  const protectedAdmin =
    (path.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(path)) ||
    (path.startsWith("/api/admin") && path !== "/api/admin/login");
  const protectedCompany =
    (path.startsWith("/empresa") && path !== "/empresa/login" && !path.startsWith("/empresa/convite")) ||
    (path.startsWith("/api/empresa") && path !== "/api/empresa/login" && path !== "/api/empresa/convite");

  context.locals.auth = null;
  context.locals.candidate = null;
  context.locals.company = null;

  const token = context.cookies.get(ADMIN_COOKIE)?.value;
  if (token) context.locals.auth = await verifySession(token);
  const candidateToken = context.cookies.get(CANDIDATE_COOKIE)?.value;
  if (candidateToken) context.locals.candidate = await verifyCandidateSession(candidateToken);
  const companyToken = context.cookies.get(COMPANY_COOKIE)?.value;
  if (companyToken) context.locals.company = await verifyCompanySession(companyToken);

  if (protectedAdmin && (!context.locals.auth || context.locals.auth.roles.length === 0)) {
    if (path.startsWith("/api/")) {
      const denied = isAdminApi
        ? await normalizeAdminApiResponse(adminJsonError("Não autenticado.", 401), requestId!)
        : Response.json({ ok: false, error: "Não autenticado." }, { status: 401 });
      denied.headers.set("X-ES-App", "astro");
      return denied;
    }
    return context.redirect(`/admin/login?next=${encodeURIComponent(path)}`, 302);
  }

  if (protectedCompany && !context.locals.company) {
    if (path.startsWith("/api/")) return Response.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    return context.redirect(`/empresa/login?next=${encodeURIComponent(path)}`, 302);
  }

  let response: Response;
  try {
    response = await next();
  } catch (error) {
    if (!isAdminApi) throw error;
    logServerError("admin-api:unhandled", error, {
      requestId: requestId!,
      route: path,
      operation: context.request.method,
      ...(context.locals.auth?.id ? { userId: context.locals.auth.id } : {}),
      code: "UNHANDLED_ADMIN_API_ERROR"
    });
    response = adminJsonError("Não foi possível concluir a operação.", 500, { code: "INTERNAL_ERROR" });
  }

  if (isAdminApi) response = await normalizeAdminApiResponse(response, requestId!);
  response.headers.set("X-ES-App", "astro");
  response.headers.set("X-Content-Type-Options", "nosniff");
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  if (path.startsWith("/empresa") || path.startsWith("/api/empresa")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
});
