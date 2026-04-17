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

export function getSiteOrigin() {
  return (
    normalizeOrigin(process.env.SITE_URL) ??
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    "http://localhost:3000"
  );
}

export function getSiteUrl(pathname = "/") {
  return new URL(pathname, getSiteOrigin()).toString();
}
