import { createHash } from "node:crypto";
import { auditLogs, brandAssetHistory, brandAssets, createDatabase, mediaAssets, settings } from "@es/db";
import { eq, desc } from "drizzle-orm";
import { BRAND_ASSETS, BRAND_COLORS } from "../brand-assets";
import {
  BRAND_ASSET_KEYS,
  FALLBACK_PATHS,
  type BrandAssetKey,
  type BrandAssetResolved,
  type BrandIdentityConfig,
  type BrandPalette,
  maxBytesForKey
} from "./constants";
import { detectMime, validateAndProcessImage, contrastRatio } from "./image-processor";
import { brandStorageKey, buildBrandPublicUrl, getBrandFile, getStorageInfo, putBrandFile, siteBaseUrl } from "./storage";
import { logServerError } from "../server-error";

const SETTINGS_KEY = "brand_identity";
const ALL_KEYS = Object.values(BRAND_ASSET_KEYS);

let cache: { config: BrandIdentityConfig; at: number } | null = null;
const CACHE_MS = 30_000;

const defaultPalette: BrandPalette = {
  brandPrimary: BRAND_COLORS.brandPrimary,
  brandPrimaryHover: BRAND_COLORS.brandPrimaryHover,
  brandSecondary: BRAND_COLORS.brandSecondary,
  brandAccent: BRAND_COLORS.brandAccent,
  brandAccentWarm: BRAND_COLORS.brandAccentWarm,
  brandBackground: BRAND_COLORS.brandBackground,
  brandSurface: BRAND_COLORS.brandSurface,
  brandBorder: BRAND_COLORS.brandBorder,
  textPrimary: BRAND_COLORS.textPrimary,
  textSecondary: BRAND_COLORS.textSecondary,
  themeColor: BRAND_ASSETS.themeColor
};

function fallbackResolved(key: BrandAssetKey): BrandAssetResolved {
  const path = FALLBACK_PATHS[key];
  return {
    key,
    url: path,
    originalUrl: null,
    width: null,
    height: null,
    mimeType: null,
    fileSize: null,
    altText: BRAND_ASSETS.logoAlt,
    versionHash: null,
    isDefault: true,
    variants: {},
    mediaId: null,
    updatedAt: null
  };
}

function resolveUrl(path: string, versionHash?: string | null) {
  if (path.startsWith("http")) {
    const v = versionHash ? (path.includes("?") ? `&v=${versionHash}` : `?v=${versionHash}`) : "";
    return `${path}${v}`;
  }
  const base = siteBaseUrl();
  const v = versionHash ? `?v=${versionHash}` : "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}${v}`;
}

function rowToResolved(row: typeof brandAssets.$inferSelect): BrandAssetResolved {
  const variants = (row.variants ?? {}) as Record<string, string>;
  return {
    key: row.key as BrandAssetKey,
    url: row.url,
    originalUrl: row.originalUrl,
    width: row.width,
    height: row.height,
    mimeType: row.mimeType,
    fileSize: row.fileSize,
    altText: row.altText,
    versionHash: row.versionHash,
    isDefault: false,
    variants,
    mediaId: row.mediaId,
    updatedAt: row.updatedAt?.toISOString() ?? null
  };
}

export function invalidateBrandCache() {
  cache = null;
}

export async function getBrandIdentity(force = false): Promise<BrandIdentityConfig> {
  if (!force && cache && Date.now() - cache.at < CACHE_MS) return cache.config;

  const storage = getStorageInfo();
  const assets = {} as Record<BrandAssetKey, BrandAssetResolved | null>;
  for (const key of ALL_KEYS) assets[key] = fallbackResolved(key);

  let meta = {
    siteName: BRAND_ASSETS.siteName,
    tagline: "Vagas verificadas em São Luís e no Maranhão",
    logoAlt: BRAND_ASSETS.logoAlt,
    useSameLogoEverywhere: false,
    palette: defaultPalette
  };

  if (process.env.DATABASE_URL) {
    const connection = createDatabase(process.env.DATABASE_URL);
    try {
      const [settingsRow] = await connection.db.select().from(settings).where(eq(settings.key, SETTINGS_KEY)).limit(1);
      if (settingsRow?.value && typeof settingsRow.value === "object") {
        const stored = settingsRow.value as Partial<typeof meta>;
        meta = {
          ...meta,
          ...stored,
          palette: { ...defaultPalette, ...(stored.palette as Partial<BrandPalette> | undefined) }
        };
      }
      const rows = await connection.db.select().from(brandAssets);
      for (const row of rows) {
        const key = row.key as BrandAssetKey;
        if (ALL_KEYS.includes(key)) assets[key] = rowToResolved(row);
      }
    } catch (error) {
      logServerError("brand-identity:load", error);
    } finally {
      await connection.close();
    }
  }

  if (meta.useSameLogoEverywhere && assets[BRAND_ASSET_KEYS.LOGO_MAIN] && !assets[BRAND_ASSET_KEYS.LOGO_MAIN]!.isDefault) {
    const main = assets[BRAND_ASSET_KEYS.LOGO_MAIN]!;
    for (const key of [BRAND_ASSET_KEYS.LOGO_DARK, BRAND_ASSET_KEYS.ADMIN_LOGO, BRAND_ASSET_KEYS.LOGIN_LOGO, BRAND_ASSET_KEYS.EMAIL_LOGO] as BrandAssetKey[]) {
      if (!assets[key] || assets[key]!.isDefault) assets[key] = { ...main, key };
    }
  }

  const version = createHash("sha256")
    .update(JSON.stringify({ meta, assets: Object.fromEntries(Object.entries(assets).map(([k, v]) => [k, v?.versionHash ?? v?.url])) }))
    .digest("hex")
    .slice(0, 16);

  const config: BrandIdentityConfig = {
    siteName: meta.siteName,
    tagline: meta.tagline,
    logoAlt: meta.logoAlt,
    useSameLogoEverywhere: meta.useSameLogoEverywhere,
    palette: meta.palette,
    assets,
    storageProvider: storage.provider,
    storageReady: storage.ready,
    version
  };
  cache = { config, at: Date.now() };
  return config;
}

export async function getBrandAssetUrl(key: BrandAssetKey, variant?: string): Promise<string> {
  const identity = await getBrandIdentity();
  const asset = identity.assets[key];
  if (!asset) return resolveUrl(FALLBACK_PATHS[key]);
  if (variant && asset.variants[variant]) return asset.variants[variant]!;
  return asset.url;
}

export async function updateBrandPalette(input: Partial<BrandPalette> & { siteName?: string; tagline?: string; logoAlt?: string; useSameLogoEverywhere?: boolean }, actorId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const current = await getBrandIdentity(true);
  const palette = { ...current.palette, ...input };
  const warnings: string[] = [];
  const primaryContrast = contrastRatio(palette.textPrimary, palette.brandSurface);
  if (primaryContrast < 4.5) warnings.push(`Contraste texto/fundo (${primaryContrast.toFixed(2)}) abaixo de 4.5:1.`);
  const btnContrast = contrastRatio("#ffffff", palette.brandPrimary);
  if (btnContrast < 4.5) warnings.push(`Contraste botão primário (${btnContrast.toFixed(2)}) abaixo de 4.5:1.`);

  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const value = {
      siteName: input.siteName ?? current.siteName,
      tagline: input.tagline ?? current.tagline,
      logoAlt: input.logoAlt ?? current.logoAlt,
      useSameLogoEverywhere: input.useSameLogoEverywhere ?? current.useSameLogoEverywhere,
      palette
    };
    await connection.db.insert(settings).values({ key: SETTINGS_KEY, value, public: true }).onConflictDoUpdate({
      target: settings.key,
      set: { value, public: true, updatedAt: new Date() }
    });
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "BRAND_PALETTE_UPDATED",
      entityType: "BRAND_IDENTITY",
      after: value,
      origin: "ADMIN"
    });
  } finally {
    await connection.close();
  }
  invalidateBrandCache();
  return { warnings };
}

export async function uploadBrandAsset(input: {
  key: BrandAssetKey;
  bytes: Uint8Array;
  filename: string;
  declaredMime: string;
  altText?: string;
  trimTransparent?: boolean;
  actorId: string;
}) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const storage = getStorageInfo();
  if (!storage.ready) throw new Error("Armazenamento não configurado. Configure S3/R2 ou volume persistente.");

  const mime = detectMime(input.bytes, input.declaredMime, input.filename);
  if (!mime) throw new Error("Formato de arquivo inválido.");
  const max = maxBytesForKey(input.key);
  if (input.bytes.length > max) throw new Error(`Arquivo excede o limite de ${(max / 1024 / 1024).toFixed(1)} MB.`);

  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  const processed = await validateAndProcessImage({
    bytes: input.bytes,
    mimeType: mime,
    assetKey: input.key,
    ...(input.trimTransparent ? { trimTransparent: true } : {})
  });

  const versionHash = processed.sha256.slice(0, 16);
  const extMap: Record<string, string> = {
    "image/png": "png",
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/svg+xml": "svg",
    "image/x-icon": "ico"
  };
  const ext = extMap[processed.original.mimeType] ?? "bin";
  const originalKey = brandStorageKey(input.key, "original", ext);
  await putBrandFile(originalKey, processed.original.body, processed.original.mimeType);

  const variantUrls: Record<string, string> = {};
  for (const variant of processed.variants) {
    const vExt = extMap[variant.mimeType] ?? "bin";
    const vKey = brandStorageKey(input.key, variant.suffix, vExt);
    await putBrandFile(vKey, variant.body, variant.mimeType);
    variantUrls[variant.suffix] = buildBrandPublicUrl(vKey, versionHash);
  }

  const publicUrl = buildBrandPublicUrl(originalKey, versionHash);
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [existing] = await connection.db.select().from(brandAssets).where(eq(brandAssets.key, input.key)).limit(1);

    const [media] = await connection.db.insert(mediaAssets).values({
      storageKey: originalKey,
      originalName: safeName,
      mimeType: processed.original.mimeType,
      size: processed.original.body.length,
      url: publicUrl,
      altText: input.altText ?? BRAND_ASSETS.logoAlt,
      metadata: { sha256: processed.sha256, brandKey: input.key, variants: Object.keys(variantUrls) }
    }).returning();

    const payload = {
      key: input.key,
      mediaId: media!.id,
      url: variantUrls.medium ?? variantUrls["medium-png"] ?? publicUrl,
      originalUrl: publicUrl,
      storageKey: originalKey,
      width: processed.original.width,
      height: processed.original.height,
      mimeType: processed.original.mimeType,
      fileSize: processed.original.body.length,
      altText: input.altText ?? BRAND_ASSETS.logoAlt,
      variants: variantUrls,
      versionHash,
      updatedBy: input.actorId,
      updatedAt: new Date()
    };

    let row;
    if (existing) {
      [row] = await connection.db.update(brandAssets).set(payload).where(eq(brandAssets.id, existing.id)).returning();
      await connection.db.insert(brandAssetHistory).values({
        assetKey: input.key,
        mediaId: media!.id,
        previousUrl: existing.url,
        newUrl: payload.url,
        action: "upload",
        actorId: input.actorId,
        metadata: { filename: safeName, trimmed: processed.trimmed }
      });
    } else {
      [row] = await connection.db.insert(brandAssets).values(payload).returning();
      await connection.db.insert(brandAssetHistory).values({
        assetKey: input.key,
        mediaId: media!.id,
        newUrl: payload.url,
        action: "upload",
        actorId: input.actorId,
        metadata: { filename: safeName }
      });
    }

    await connection.db.insert(auditLogs).values({
      actorId: input.actorId,
      action: "BRAND_ASSET_UPLOADED",
      entityType: "BRAND_ASSET",
      entityId: row!.id,
      before: existing ?? null,
      after: row,
      origin: "ADMIN"
    });

    invalidateBrandCache();
    return rowToResolved(row!);
  } finally {
    await connection.close();
  }
}

export async function removeBrandAsset(key: BrandAssetKey, actorId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [existing] = await connection.db.select().from(brandAssets).where(eq(brandAssets.key, key)).limit(1);
    if (!existing) return;
    await connection.db.delete(brandAssets).where(eq(brandAssets.id, existing.id));
    await connection.db.insert(brandAssetHistory).values({
      assetKey: key,
      mediaId: existing.mediaId,
      previousUrl: existing.url,
      action: "remove",
      actorId,
      metadata: {}
    });
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "BRAND_ASSET_REMOVED",
      entityType: "BRAND_ASSET",
      entityId: existing.id,
      before: existing,
      origin: "ADMIN"
    });
  } finally {
    await connection.close();
  }
  invalidateBrandCache();
}

export async function restoreBrandAssetFromHistory(historyId: string, actorId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não configurada.");
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const [entry] = await connection.db.select().from(brandAssetHistory).where(eq(brandAssetHistory.id, historyId)).limit(1);
    if (!entry || !entry.previousUrl) throw new Error("Histórico inválido para restauração.");
    const key = entry.assetKey as BrandAssetKey;
    const [existing] = await connection.db.select().from(brandAssets).where(eq(brandAssets.key, key)).limit(1);
    const payload = {
      key,
      mediaId: entry.mediaId,
      url: entry.previousUrl,
      originalUrl: entry.previousUrl,
      storageKey: existing?.storageKey ?? null,
      width: existing?.width ?? null,
      height: existing?.height ?? null,
      mimeType: existing?.mimeType ?? null,
      fileSize: existing?.fileSize ?? null,
      altText: existing?.altText ?? BRAND_ASSETS.logoAlt,
      variants: (existing?.variants ?? {}) as Record<string, string>,
      versionHash: createHash("sha256").update(entry.previousUrl).digest("hex").slice(0, 16),
      updatedBy: actorId,
      updatedAt: new Date()
    };
    if (existing) {
      await connection.db.update(brandAssets).set(payload).where(eq(brandAssets.id, existing.id));
    } else {
      await connection.db.insert(brandAssets).values({ ...payload, url: entry.previousUrl });
    }
    await connection.db.insert(brandAssetHistory).values({
      assetKey: key,
      previousUrl: existing?.url ?? null,
      newUrl: entry.previousUrl,
      action: "restore",
      actorId,
      metadata: { historyId }
    });
    await connection.db.insert(auditLogs).values({
      actorId,
      action: "BRAND_ASSET_RESTORED",
      entityType: "BRAND_ASSET",
      after: payload,
      origin: "ADMIN"
    });
  } finally {
    await connection.close();
  }
  invalidateBrandCache();
}

export async function listBrandHistory(key?: BrandAssetKey, limit = 50) {
  if (!process.env.DATABASE_URL) return [];
  const connection = createDatabase(process.env.DATABASE_URL);
  try {
    const rows = await connection.db.select().from(brandAssetHistory).orderBy(desc(brandAssetHistory.createdAt)).limit(limit);
    return key ? rows.filter((r) => r.assetKey === key) : rows;
  } finally {
    await connection.close();
  }
}

export async function serveBrandAssetFile(storageKey: string) {
  return getBrandFile(decodeURIComponent(storageKey));
}

export function brandIdentityToVisualIdentity(config: BrandIdentityConfig) {
  const main = config.assets[BRAND_ASSET_KEYS.LOGO_MAIN];
  const dark = config.assets[BRAND_ASSET_KEYS.LOGO_DARK];
  const icon = config.assets[BRAND_ASSET_KEYS.ICON];
  return {
    siteName: config.siteName,
    primaryColor: config.palette.brandPrimary,
    logoUrl: main?.url ?? FALLBACK_PATHS[BRAND_ASSET_KEYS.LOGO_MAIN],
    logoUrlDark: dark?.url ?? main?.url ?? FALLBACK_PATHS[BRAND_ASSET_KEYS.LOGO_DARK],
    iconUrl: icon?.url ?? FALLBACK_PATHS[BRAND_ASSET_KEYS.ICON],
    tagline: config.tagline
  };
}
