/** Chave estável para casar applyUrl/sourceUrl entre planilha e banco. */
export function normalizeJobListingUrlKey(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    const u = new URL(trimmed);
    u.hash = "";
    u.search = "";
    let path = u.pathname || "/";
    path = path.replace(/\/+$/, "") || "/";
    u.pathname = path;
    return `${u.protocol}//${u.host}${u.pathname}`.toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}
