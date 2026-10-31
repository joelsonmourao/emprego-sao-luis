import { createHash } from "node:crypto";
import sharp from "sharp";
import type { BrandAssetKey } from "./constants";
import { BRAND_ASSET_KEYS } from "./constants";

const RASTER = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type ProcessedVariant = {
  suffix: string;
  body: Uint8Array;
  mimeType: string;
  width: number;
  height: number;
};

export type ProcessedBrandImage = {
  original: ProcessedVariant;
  variants: ProcessedVariant[];
  sha256: string;
  trimmed: boolean;
};

export function sanitizeSvg(content: string): string | null {
  const lower = content.toLowerCase();
  if (/<script|javascript:|onload=|onerror=|<iframe|data:text\/html/i.test(lower)) return null;
  return content.replace(/<\?xml[^?]*\?>/i, "").trim();
}

export async function validateAndProcessImage(input: {
  bytes: Uint8Array;
  mimeType: string;
  assetKey: BrandAssetKey;
  trimTransparent?: boolean;
}): Promise<ProcessedBrandImage> {
  const sha256 = createHash("sha256").update(input.bytes).digest("hex");

  if (input.mimeType === "image/svg+xml") {
    const text = new TextDecoder().decode(input.bytes);
    const safe = sanitizeSvg(text);
    if (!safe) throw new Error("SVG não permitido: conteúdo inseguro detectado.");
    const body = new TextEncoder().encode(safe);
    return {
      original: { suffix: "original", body, mimeType: "image/svg+xml", width: 0, height: 0 },
      variants: [],
      sha256,
      trimmed: false
    };
  }

  if (input.mimeType === "image/x-icon" || input.mimeType === "image/vnd.microsoft.icon") {
    if (input.assetKey !== BRAND_ASSET_KEYS.FAVICON) throw new Error("ICO permitido apenas no favicon.");
    let meta;
    try {
      meta = await sharp(Buffer.from(input.bytes)).metadata();
    } catch {
      throw new Error("Arquivo ICO corrompido ou inválido.");
    }
    return {
      original: {
        suffix: "original",
        body: input.bytes,
        mimeType: "image/x-icon",
        width: meta.width ?? 32,
        height: meta.height ?? 32
      },
      variants: [],
      sha256,
      trimmed: false
    };
  }

  if (!RASTER.has(input.mimeType)) throw new Error("Formato não suportado.");

  let pipeline = sharp(Buffer.from(input.bytes), { failOn: "error" });
  const meta = await pipeline.metadata();
  if (!meta.width || !meta.height) throw new Error("Não foi possível ler dimensões da imagem.");

  let trimmed = false;
  if (input.trimTransparent && meta.hasAlpha) {
    try {
      const trimmedBuf = await sharp(Buffer.from(input.bytes)).trim().png().toBuffer();
      const trimmedMeta = await sharp(trimmedBuf).metadata();
      if (trimmedMeta.width && trimmedMeta.height && trimmedMeta.width <= meta.width && trimmedMeta.height <= meta.height) {
        pipeline = sharp(trimmedBuf);
        trimmed = true;
      }
    } catch {
      /* keep original if trim fails */
    }
  }

  const originalBuf = await pipeline.clone().png({ compressionLevel: 9 }).toBuffer();
  const originalMeta = await sharp(originalBuf).metadata();
  const original: ProcessedVariant = {
    suffix: "original",
    body: new Uint8Array(originalBuf),
    mimeType: "image/png",
    width: originalMeta.width ?? meta.width,
    height: originalMeta.height ?? meta.height
  };

  const variants: ProcessedVariant[] = [];
  const sizes = assetSizes(input.assetKey);
  for (const size of sizes) {
    const resized = await sharp(originalBuf)
      .resize(size.width, size.height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();
    const resizedMeta = await sharp(resized).metadata();
    variants.push({
      suffix: size.name,
      body: new Uint8Array(resized),
      mimeType: "image/webp",
      width: resizedMeta.width ?? size.width,
      height: resizedMeta.height ?? size.height
    });
    const pngVariant = await sharp(originalBuf)
      .resize(size.width, size.height, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const pngMeta = await sharp(pngVariant).metadata();
    variants.push({
      suffix: `${size.name}-png`,
      body: new Uint8Array(pngVariant),
      mimeType: "image/png",
      width: pngMeta.width ?? size.width,
      height: pngMeta.height ?? size.height
    });
  }

  if (input.assetKey === BRAND_ASSET_KEYS.FAVICON) {
    const fav32 = await sharp(originalBuf).resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    variants.push({ suffix: "favicon-32", body: new Uint8Array(fav32), mimeType: "image/png", width: 32, height: 32 });
    const fav16 = await sharp(originalBuf).resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    variants.push({ suffix: "favicon-16", body: new Uint8Array(fav16), mimeType: "image/png", width: 16, height: 16 });
  }

  if (input.assetKey === BRAND_ASSET_KEYS.PWA_192) {
    const pwa = await sharp(originalBuf).resize(192, 192, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
    variants.push({ suffix: "pwa192", body: new Uint8Array(pwa), mimeType: "image/png", width: 192, height: 192 });
  }
  if (input.assetKey === BRAND_ASSET_KEYS.PWA_512) {
    const pwa = await sharp(originalBuf).resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
    variants.push({ suffix: "pwa512", body: new Uint8Array(pwa), mimeType: "image/png", width: 512, height: 512 });
  }
  if (input.assetKey === BRAND_ASSET_KEYS.APPLE_TOUCH) {
    const apple = await sharp(originalBuf).resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } }).png().toBuffer();
    variants.push({ suffix: "apple-touch", body: new Uint8Array(apple), mimeType: "image/png", width: 180, height: 180 });
  }

  return { original, variants, sha256, trimmed };
}

function assetSizes(key: BrandAssetKey) {
  if (key === BRAND_ASSET_KEYS.ICON || key === BRAND_ASSET_KEYS.INSTAGRAM_IMAGE) {
    return [{ name: "small", width: 96, height: 96 }, { name: "medium", width: 192, height: 192 }, { name: "large", width: 384, height: 384 }];
  }
  if (key.includes("logo")) {
    return [{ name: "small", width: 160, height: 48 }, { name: "medium", width: 320, height: 96 }, { name: "large", width: 640, height: 192 }];
  }
  if (key === BRAND_ASSET_KEYS.OG_DEFAULT) {
    return [{ name: "og", width: 1200, height: 630 }];
  }
  return [{ name: "medium", width: 512, height: 512 }];
}

export function detectMime(buffer: Uint8Array, declared: string, filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return "image/gif";
  if (buffer.length > 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return "image/webp";
  if (ext === "ico" || declared === "image/x-icon") return "image/x-icon";
  if (ext === "svg" || declared === "image/svg+xml") return "image/svg+xml";
  if (RASTER.has(declared)) return declared;
  return null;
}

export function contrastRatio(foreground: string, background: string): number {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const l1 = lum(foreground);
  const l2 = lum(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
