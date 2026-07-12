import { defineMiddleware } from "astro:middleware";
import "./instrumentation";
import { ADMIN_COOKIE, verifySession } from "./lib/auth";
import { CANDIDATE_COOKIE, verifyCandidateSession } from "./lib/candidate-auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const protectedPath = path.startsWith("/admin") && path !== "/admin/login" || path.startsWith("/api/admin") && path !== "/api/admin/login";
  context.locals.auth = null;
  context.locals.candidate = null;
  const token = context.cookies.get(ADMIN_COOKIE)?.value;
  if (token) context.locals.auth = await verifySession(token);
  const candidateToken = context.cookies.get(CANDIDATE_COOKIE)?.value;
  if (candidateToken) context.locals.candidate = await verifyCandidateSession(candidateToken);
  if (protectedPath && (!context.locals.auth || context.locals.auth.roles.length === 0)) {
    if (path.startsWith("/api/")) { const denied = Response.json({ ok: false, error: "Não autenticado." }, { status: 401 }); denied.headers.set("X-ES-App", "astro"); return denied; }
    return context.redirect(`/admin/login?next=${encodeURIComponent(path)}`, 302);
  }
  const response = await next();
  response.headers.set("X-ES-App", "astro");
  response.headers.set("X-Content-Type-Options", "nosniff");
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
});
