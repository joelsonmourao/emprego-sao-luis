const PRODUCTION_SITE = "https://empregossaoluis.com.br";

function isLocalOrPrivateHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) return true;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") return true;
  if (host.endsWith(".local") || host.endsWith(".localhost")) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

function isUsablePublicOrigin(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return !isLocalOrPrivateHost(url.hostname);
}

function normalizePathname(pathname: string): string {
  const raw = pathname?.trim() || "/";
  if (raw === "/") return "/";
  return raw.replace(/\/+$/, "") || "/";
}

export function getRuntimeSiteUrl(fallback?: URL): URL {
  const configured = process.env.SITE_URL?.trim();
  if (configured) {
    try {
      const parsed = new URL(configured);
      if (isUsablePublicOrigin(parsed)) {
        parsed.pathname = "/";
        parsed.search = "";
        parsed.hash = "";
        return parsed;
      }
    } catch {
      // A malformed runtime value must not make public pages fail to render.
    }
  }
  if (fallback && isUsablePublicOrigin(fallback)) {
    const normalized = new URL(fallback.origin);
    normalized.pathname = "/";
    return normalized;
  }
  return new URL(PRODUCTION_SITE);
}

export function resolvePublicHttpUrl(candidate: string | undefined, site?: URL): string | undefined {
  if (!candidate?.trim()) return undefined;
  try {
    const resolved = new URL(candidate, site ?? getRuntimeSiteUrl());
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return undefined;
    if (isLocalOrPrivateHost(resolved.hostname)) return undefined;
    return resolved.toString();
  } catch {
    return undefined;
  }
}

export function resolveCanonicalUrl(candidate: string | undefined, pathname: string, site?: URL): string {
  const ownedSite = site ?? getRuntimeSiteUrl();
  const expectedPath = normalizePathname(pathname || "/");
  const fallback = new URL(expectedPath, ownedSite);
  let resolved = fallback;

  if (candidate?.trim()) {
    try {
      const parsed = new URL(candidate, ownedSite);
      if (parsed.origin === ownedSite.origin && normalizePathname(parsed.pathname) === expectedPath) {
        resolved = parsed;
      }
    } catch {
      resolved = fallback;
    }
  }

  resolved.search = "";
  resolved.hash = "";
  resolved.pathname = normalizePathname(resolved.pathname);
  return resolved.toString();
}
