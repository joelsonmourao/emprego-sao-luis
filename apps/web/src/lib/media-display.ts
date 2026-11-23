import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const IMAGE_EXT = /\.(webp|png|jpe?g|gif|svg|ico)$/i;

/** Torna URL de mídia usable no admin (mesmo host). */
export function resolveMediaDisplayUrl(input: { url?: string | null; storageKey?: string | null }): string {
  const key = input.storageKey?.trim();
  if (key && (key.startsWith("media/") || key.startsWith("brand/"))) {
    return `/api/uploads/${key.split("/").map(encodeURIComponent).join("/")}`;
  }

  const url = String(input.url ?? "").trim();
  if (!url) return "";

  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    const uploadsMatch = parsed.pathname.match(/\/api\/uploads\/(.+)$/);
    if (uploadsMatch?.[1]) return `/api/uploads/${uploadsMatch[1]}`;
    if (parsed.pathname.startsWith("/")) return parsed.pathname + parsed.search;
  } catch {
    // ignore
  }

  return url;
}

export type SiteStaticImage = {
  path: string;
  group: "brand" | "covers" | "icons" | "other";
  name: string;
};

function walkImages(dir: string, basePublic: string, group: SiteStaticImage["group"], out: SiteStaticImage[], depth = 0) {
  if (depth > 4) return;
  let entries: string[] = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walkImages(full, basePublic, group, out, depth + 1);
      continue;
    }
    if (!IMAGE_EXT.test(entry)) continue;
    const rel = relative(basePublic, full).replace(/\\/g, "/");
    out.push({ path: `/${rel}`, group, name: entry });
  }
}

export function resolvePublicAssetsDir(): string {
  const cwd = process.cwd();
  const candidates = [
    resolve(cwd, "apps/web/public"),
    resolve(cwd, "public"),
    resolve(cwd, "dist/client"),
    resolve(cwd, "apps/web/dist/client")
  ];
  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isDirectory()) return candidate;
    } catch {
      // try next
    }
  }
  return candidates[0]!;
}

/** Lista imagens estáticas em public/ (brand, capas, ícones). */
export function listSiteStaticImages(publicDir = resolvePublicAssetsDir()): SiteStaticImage[] {
  const out: SiteStaticImage[] = [];
  walkImages(join(publicDir, "brand"), publicDir, "brand", out);
  walkImages(join(publicDir, "covers"), publicDir, "covers", out);
  for (const name of [
    "favicon.svg",
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon-48x48.png",
    "apple-touch-icon.png",
    "icon-192.png",
    "icon-512.png",
    "icon.png"
  ]) {
    try {
      const full = join(publicDir, name);
      if (statSync(full).isFile()) out.push({ path: `/${name}`, group: "icons", name });
    } catch {
      // skip
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path, "pt-BR"));
}
