import {
  buildStoragePublicUrl,
  getStorageInfo as getSharedStorageInfo,
  getStorageObject,
  guessStorageContentType,
  putStorageObject
} from "@es/storage";

export type StorageProvider = "s3" | "volume" | "unconfigured";

export function getStorageInfo(): { provider: StorageProvider; ready: boolean; path?: string } {
  const info = getSharedStorageInfo();
  return { provider: info.provider, ready: info.ready, path: info.path };
}

export function siteBaseUrl() {
  const raw = process.env.SITE_URL ?? "https://empregossaoluis.com.br";
  return raw.replace(/\/$/, "").replace("://www.", "://");
}

export function buildBrandPublicUrl(storageKey: string, versionHash?: string | null) {
  const base = buildStoragePublicUrl(storageKey, siteBaseUrl());
  return versionHash ? `${base}?v=${encodeURIComponent(versionHash)}` : base;
}

export async function putBrandFile(storageKey: string, body: Uint8Array, contentType: string) {
  await putStorageObject(storageKey, body, contentType);
}

export async function getBrandFile(storageKey: string): Promise<{ body: Uint8Array; contentType: string } | null> {
  try {
    return {
      body: await getStorageObject(storageKey),
      contentType: guessStorageContentType(storageKey)
    };
  } catch {
    return null;
  }
}

export function brandStorageKey(assetKey: string, suffix: string, ext: string) {
  const safe = assetKey.replace(/\./g, "/");
  const stamp = Date.now().toString(36);
  return `brand/${safe}/${stamp}-${suffix}.${ext}`;
}
