import { defineMiddleware } from "astro:middleware";
import "./instrumentation";
import { ADMIN_COOKIE, verifySession } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  const protectedPath = path.startsWith("/admin") && path !== "/admin/login" || path.startsWith("/api/admin") && path !== "/api/admin/login";
  context.locals.auth = null;
  const token = context.cookies.get(ADMIN_COOKIE)?.value;
  if (token) context.locals.auth = await verifySession(token);
  if (protectedPath && !context.locals.auth) {
    if (path.startsWith("/api/")) return Response.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    return context.redirect(`/admin/login?next=${encodeURIComponent(path)}`, 302);
  }
  const response = await next();
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
});
