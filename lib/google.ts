export function normalizeAdsensePublisherId(value?: string | null) {
  const trimmed = (value ?? "").trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("ca-pub-")) {
    return trimmed;
  }

  if (trimmed.startsWith("pub-")) {
    return `ca-${trimmed}`;
  }

  return trimmed.startsWith("ca-") ? trimmed : `ca-pub-${trimmed.replace(/^pub-/, "")}`;
}

export function buildAdsTxtFromPublisher(value?: string | null) {
  const publisherId = normalizeAdsensePublisherId(value);

  if (!publisherId.startsWith("ca-pub-")) {
    return "";
  }

  return `google.com, ${publisherId.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
}

export function normalizeSearchConsoleVerification(value?: string | null) {
  const trimmed = (value ?? "").trim();

  if (!trimmed) {
    return "";
  }

  const contentMatch = trimmed.match(/content=["']([^"']+)["']/i);
  if (contentMatch?.[1]) {
    return contentMatch[1];
  }

  return trimmed.replace(/^google-site-verification=/i, "").trim();
}
