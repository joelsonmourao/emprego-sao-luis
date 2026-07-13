import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { putPrivateObject, getPrivateObject } from "../storage";

export type StorageProvider = "s3" | "volume" | "unconfigured";

function s3Configured() {
  return Boolean(
    process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  );
}

function volumePath() {
  return process.env.BRAND_UPLOADS_PATH?.trim() ||
    process.env.UPLOADS_VOLUME_PATH?.trim() ||
    join(process.cwd(), "data", "brand-uploads");
}

export function getStorageInfo(): { provider: StorageProvider; ready: boolean; path?: string } {
  if (s3Configured()) return { provider: "s3", ready: true };
  const path = volumePath();
  return { provider: "volume", ready: true, path };
}

export function siteBaseUrl() {
  const raw = process.env.SITE_URL ?? "https://empregossaoluis.com.br";
  return raw.replace(/\/$/, "").replace("://www.", "://");
}

export function buildBrandPublicUrl(storageKey: string, versionHash?: string | null) {
  const base = siteBaseUrl();
  const v = versionHash ? `?v=${versionHash}` : "";
  if (s3Configured()) {
    const publicBase = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
    if (publicBase) return `${publicBase}/${storageKey}${v}`;
  }
  return `${base}/api/brand-assets/${encodeURIComponent(storageKey)}${v}`;
}

export async function putBrandFile(storageKey: string, body: Uint8Array, contentType: string) {
  if (s3Configured()) {
    await putPrivateObject(storageKey, body, contentType);
    return;
  }
  const filePath = join(volumePath(), storageKey);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, body);
}

export async function getBrandFile(storageKey: string): Promise<{ body: Uint8Array; contentType: string } | null> {
  if (s3Configured()) {
    try {
      const body = await getPrivateObject(storageKey);
      return { body, contentType: guessMime(storageKey) };
    } catch {
      return null;
    }
  }
  try {
    const filePath = join(volumePath(), storageKey);
    const body = await readFile(filePath);
    return { body: new Uint8Array(body), contentType: guessMime(storageKey) };
  } catch {
    return null;
  }
}

function guessMime(key: string) {
  if (key.endsWith(".webp")) return "image/webp";
  if (key.endsWith(".png")) return "image/png";
  if (key.endsWith(".jpg") || key.endsWith(".jpeg")) return "image/jpeg";
  if (key.endsWith(".ico")) return "image/x-icon";
  if (key.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

export function brandStorageKey(assetKey: string, suffix: string, ext: string) {
  const safe = assetKey.replace(/\./g, "/");
  const stamp = Date.now().toString(36);
  return `brand/${safe}/${stamp}-${suffix}.${ext}`;
}
