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
  // #region agent log
  fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
    body: JSON.stringify({
      sessionId: "582712",
      runId: "sitemap-debug-1",
      hypothesisId: "H1",
      location: "lib/site-url.ts:getSiteOrigin:entry",
      message: "site origin input states",
      data: {
        hasSiteUrl: Boolean(process.env.SITE_URL),
        hasPublicSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
        normalizedSiteUrl: siteUrl ?? null,
        normalizedPublicSiteUrl: publicSiteUrl ?? null,
        isProduction
      },
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion

  if (isProduction) {
    if (!siteUrl) {
      // #region agent log
      fetch("http://127.0.0.1:7370/ingest/b54ed65d-267c-4421-b3af-1ea0f3df3748", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "582712" },
        body: JSON.stringify({
          sessionId: "582712",
          runId: "sitemap-debug-1",
          hypothesisId: "H1",
          location: "lib/site-url.ts:getSiteOrigin:throw",
          message: "site url missing in production",
          data: {},
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      throw new Error("SITE_URL precisa estar configurada em producao para gerar URLs publicas de SEO.");
    }

    return siteUrl;
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
