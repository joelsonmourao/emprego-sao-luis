export const BRAND_ASSET_KEYS = {
  LOGO_MAIN: "brand.logo.main",
  LOGO_DARK: "brand.logo.dark",
  ICON: "brand.icon",
  FAVICON: "brand.favicon",
  APPLE_TOUCH: "brand.appleTouchIcon",
  PWA_192: "brand.pwa192",
  PWA_512: "brand.pwa512",
  OG_DEFAULT: "brand.ogDefault",
  EMAIL_LOGO: "brand.emailLogo",
  ADMIN_LOGO: "brand.adminLogo",
  LOGIN_LOGO: "brand.loginLogo",
  INSTAGRAM_IMAGE: "brand.instagramImage"
} as const;

export type BrandAssetKey = (typeof BRAND_ASSET_KEYS)[keyof typeof BRAND_ASSET_KEYS];

export const BRAND_ASSET_LABELS: Record<BrandAssetKey, string> = {
  [BRAND_ASSET_KEYS.LOGO_MAIN]: "Logo horizontal principal",
  [BRAND_ASSET_KEYS.LOGO_DARK]: "Logo horizontal para fundo escuro",
  [BRAND_ASSET_KEYS.ICON]: "Símbolo ou ícone quadrado",
  [BRAND_ASSET_KEYS.FAVICON]: "Favicon",
  [BRAND_ASSET_KEYS.APPLE_TOUCH]: "Apple Touch Icon",
  [BRAND_ASSET_KEYS.PWA_192]: "Ícone PWA 192×192",
  [BRAND_ASSET_KEYS.PWA_512]: "Ícone PWA 512×512",
  [BRAND_ASSET_KEYS.OG_DEFAULT]: "Imagem Open Graph padrão",
  [BRAND_ASSET_KEYS.EMAIL_LOGO]: "Logo para e-mails",
  [BRAND_ASSET_KEYS.ADMIN_LOGO]: "Logo do painel administrativo",
  [BRAND_ASSET_KEYS.LOGIN_LOGO]: "Logo da tela de login",
  [BRAND_ASSET_KEYS.INSTAGRAM_IMAGE]: "Imagem da seção Instagram"
};

export const BRAND_ASSET_GROUPS: Array<{ title: string; keys: BrandAssetKey[] }> = [
  { title: "Logos", keys: [BRAND_ASSET_KEYS.LOGO_MAIN, BRAND_ASSET_KEYS.LOGO_DARK] },
  { title: "Ícones e favicon", keys: [BRAND_ASSET_KEYS.ICON, BRAND_ASSET_KEYS.FAVICON, BRAND_ASSET_KEYS.APPLE_TOUCH, BRAND_ASSET_KEYS.PWA_192, BRAND_ASSET_KEYS.PWA_512] },
  { title: "Redes sociais", keys: [BRAND_ASSET_KEYS.OG_DEFAULT, BRAND_ASSET_KEYS.INSTAGRAM_IMAGE] },
  { title: "E-mail", keys: [BRAND_ASSET_KEYS.EMAIL_LOGO] },
  { title: "Painel administrativo", keys: [BRAND_ASSET_KEYS.ADMIN_LOGO, BRAND_ASSET_KEYS.LOGIN_LOGO] }
];

export const UPLOAD_LIMITS = {
  logo: 5 * 1024 * 1024,
  favicon: 1 * 1024 * 1024,
  og: 8 * 1024 * 1024,
  default: 5 * 1024 * 1024
} as const;

export function maxBytesForKey(key: BrandAssetKey): number {
  if (key === BRAND_ASSET_KEYS.FAVICON) return UPLOAD_LIMITS.favicon;
  if (key === BRAND_ASSET_KEYS.OG_DEFAULT) return UPLOAD_LIMITS.og;
  if (key.includes("logo") || key === BRAND_ASSET_KEYS.ICON) return UPLOAD_LIMITS.logo;
  return UPLOAD_LIMITS.default;
}
export const FALLBACK_PATHS: Record<BrandAssetKey, string> = {
  [BRAND_ASSET_KEYS.LOGO_MAIN]: "/brand/logo-horizontal.webp",
  [BRAND_ASSET_KEYS.LOGO_DARK]: "/brand/logo-horizontal.webp",
  [BRAND_ASSET_KEYS.ICON]: "/brand/icon.webp",
  [BRAND_ASSET_KEYS.FAVICON]: "/favicon.ico",
  [BRAND_ASSET_KEYS.APPLE_TOUCH]: "/apple-touch-icon.png",
  [BRAND_ASSET_KEYS.PWA_192]: "/icon-192.png",
  [BRAND_ASSET_KEYS.PWA_512]: "/icon-512.png",
  [BRAND_ASSET_KEYS.OG_DEFAULT]: "/brand/logo-horizontal.png",
  [BRAND_ASSET_KEYS.EMAIL_LOGO]: "/brand/logo-horizontal.png",
  [BRAND_ASSET_KEYS.ADMIN_LOGO]: "/brand/logo-horizontal.webp",
  [BRAND_ASSET_KEYS.LOGIN_LOGO]: "/brand/logo-horizontal.webp",
  [BRAND_ASSET_KEYS.INSTAGRAM_IMAGE]: "/brand/icon.webp"
};

export interface BrandPalette {
  brandPrimary: string;
  brandPrimaryHover: string;
  brandSecondary: string;
  brandAccent: string;
  brandAccentWarm: string;
  brandBackground: string;
  brandSurface: string;
  brandBorder: string;
  textPrimary: string;
  textSecondary: string;
  themeColor: string;
}

export interface BrandIdentityConfig {
  siteName: string;
  tagline: string;
  logoAlt: string;
  useSameLogoEverywhere: boolean;
  palette: BrandPalette;
  assets: Record<BrandAssetKey, BrandAssetResolved | null>;
  storageProvider: "s3" | "volume" | "unconfigured";
  storageReady: boolean;
  version: string;
}

export interface BrandAssetResolved {
  key: BrandAssetKey;
  url: string;
  originalUrl: string | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  fileSize: number | null;
  altText: string | null;
  versionHash: string | null;
  isDefault: boolean;
  variants: Record<string, string>;
  mediaId: string | null;
  updatedAt: string | null;
}
