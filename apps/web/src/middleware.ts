import { defineMiddleware } from "astro:middleware";
import "./instrumentation";
import { ADMIN_COOKIE, verifySession } from "./lib/auth";
import { CANDIDATE_COOKIE, verifyCandidateSession } from "./lib/candidate-auth";
import { createDatabase, redirects } from "@es/db";
import { and, eq } from "drizzle-orm";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  if (context.request.method === "GET" && process.env.DATABASE_URL && !path.startsWith("/api/") && !path.startsWith("/admin")) { const connection = createDatabase(process.env.DATABASE_URL); try { const [rule] = await connection.db.select().from(redirects).where(and(eq(redirects.sourcePath, path), eq(redirects.active, true))).limit(1); if (rule && rule.destinationPath !== path) { const status = ([301, 302, 303, 307, 308] as const).find((value) => value === rule.statusCode) ?? 301; return context.redirect(rule.destinationPath, status); } } finally { await connection.close(); } }
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
