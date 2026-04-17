function normalizeOrigin(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function isLocalOrigin(value: string) {
  return value.includes("localhost") || value.includes("127.0.0.1");
}

export function getSiteOrigin() {
  const siteUrl = normalizeOrigin(process.env.SITE_URL);
  const publicSiteUrl = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  const isProduction = process.env.NODE_ENV === "production";

  if (siteUrl) {
    return siteUrl;
  }

  if (!isProduction && publicSiteUrl) {
    return publicSiteUrl;
  }

  if (isProduction && publicSiteUrl && !isLocalOrigin(publicSiteUrl) && !publicSiteUrl.includes("vercel.app")) {
    return publicSiteUrl;
  }

  return "http://localhost:3000";
}

export function getSiteUrl(pathname = "/") {
  return new URL(pathname, getSiteOrigin()).toString();
}
