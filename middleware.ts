import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_AUTH_COOKIE, verifyAdminSessionToken } from "@/lib/auth-token";
import { isRemovedJobSlug } from "@/lib/seo/removed-job-slugs";
import { JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS } from "@/lib/seo/vagas-job-path";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicBypassPath =
    pathname === "/" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/sitemaps/") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg";

  if (isPublicBypassPath) {
    return NextResponse.next();
  }

  const hostname = request.nextUrl.hostname.toLowerCase();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  const isSecureRequest = request.nextUrl.protocol === "https:" || forwardedProto === "https";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-app-section", isAdminPage || isAdminApi ? "admin" : "public");
  requestHeaders.set("x-pathname", pathname);

  if (!isAdminPage && !isAdminApi) {
    const publicToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
    if (publicToken) {
      const publicSession = await verifyAdminSessionToken(publicToken);
      if (publicSession) {
        requestHeaders.set("x-suppress-public-ads", "1");
      }
    }
  }

  if (hostname === "www.empregossaoluis.com.br") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.hostname = "empregossaoluis.com.br";
    canonicalUrl.protocol = "https:";
    return NextResponse.redirect(canonicalUrl, 301);
  }

  const jobDetailMatch = pathname.match(/^\/vagas\/([^/]+)$/);
  if (jobDetailMatch) {
    const slug = jobDetailMatch[1];
    if (!JOB_DETAIL_PATH_RESERVED_FIRST_SEGMENTS.has(slug) && isRemovedJobSlug(slug)) {
      const goneUrl = request.nextUrl.clone();
      goneUrl.pathname = `/vagas/indisponivel/${slug}`;
      const goneResponse = NextResponse.rewrite(goneUrl, { status: 410 });
      goneResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
      return goneResponse;
    }
  }

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;

    if (!isLoginPage && !isLoginApi) {
      const session = token ? await verifyAdminSessionToken(token) : null;

      if (!session) {
        if (isAdminApi) {
          return NextResponse.json({ ok: false, error: "Nao autenticado." }, { status: 401 });
        }

        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.googleadservices.com https://tpc.googlesyndication.com https://ep2.adtrafficquality.google",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://csi.gstatic.com https://www.google.com",
    "frame-src 'self' https://www.googletagmanager.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://ep2.adtrafficquality.google",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ];
  if (isSecureRequest) {
    cspDirectives.push("upgrade-insecure-requests");
  }
  const contentSecurityPolicy = cspDirectives.join("; ");

  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  if (isAdminPage || isAdminApi) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sitemap-fresh.xml|sitemaps/|ads.txt|icon.svg).*)"]
};
