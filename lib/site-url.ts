export function normalizeOrigin(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (/^www\./i.test(url.hostname)) {
      url.hostname = url.hostname.replace(/^www\./i, "");
    }
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

  if (isProduction) {
    if (siteUrl) {
      return siteUrl;
    }

    const fallback = publicSiteUrl || "http://localhost:3000";
    // #region agent log
    fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
      body: JSON.stringify({
        sessionId: "582712",
        runId: "no-available-server",
        hypothesisId: "H_PROD_SITE_URL_MISSING",
        location: "lib/site-url.ts:getSiteOrigin",
        message: "SITE_URL ausente em producao; usando fallback para evitar indisponibilidade",
        data: {
          hasSiteUrl: Boolean(siteUrl),
          hasPublicSiteUrl: Boolean(publicSiteUrl),
          fallback
        },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    return fallback;
  }

  if (publicSiteUrl) {
    return publicSiteUrl;
  }

  if (siteUrl && isLocalOrigin(siteUrl)) {
    return siteUrl;
  }

  return "http://localhost:3000";
}

export function getSiteUrl(pathname = "/") {
  return new URL(pathname, getSiteOrigin()).toString();
}
