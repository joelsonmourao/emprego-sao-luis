export const BRAND_ASSETS = {
  logoHorizontalWebp: "/brand/logo-horizontal.webp",
  logoHorizontalPng: "/brand/logo-horizontal.png",
  iconWebp: "/brand/icon.webp",
  faviconSvg: "/favicon.svg",
  faviconIco: "/favicon.ico",
  favicon16: "/favicon-16x16.png",
  favicon32: "/favicon-32x32.png",
  appleTouchIcon: "/apple-touch-icon.png",
  icon192: "/icon-192.png",
  icon512: "/icon-512.png",
  manifest: "/site.webmanifest",
  themeColor: "#9B2D30",
  instagramUrl: "https://www.instagram.com/empregosaoluis/",
  instagramHandle: "@empregosaoluis",
  siteName: "Empregos São Luís",
  logoAlt: "Empregos São Luís — vagas em São Luís e Maranhão"
} as const;

export const BRAND_COLORS = {
  brandPrimary: "#9B2D30",
  brandPrimaryHover: "#B33A3D",
  brandSecondary: "#1A1A1A",
  brandAccent: "#E41E26",
  brandAccentWarm: "#F58220",
  brandBackground: "#F5F5F5",
  brandSurface: "#FFFFFF",
  brandBorder: "#E0E0E0",
  textPrimary: "#1A1A1A",
  textSecondary: "#5C5C5C",
  success: "#15803D",
  warning: "#CA8A04",
  danger: "#DC2626",
  info: "#2563EB"
} as const;

export function brandCssVariables(): string {
  const c = BRAND_COLORS;
  return `:root {
  --brand-primary: ${c.brandPrimary};
  --brand-primary-hover: ${c.brandPrimaryHover};
  --brand-secondary: ${c.brandSecondary};
  --brand-accent: ${c.brandAccent};
  --brand-accent-warm: ${c.brandAccentWarm};
  --brand-background: ${c.brandBackground};
  --brand-surface: ${c.brandSurface};
  --brand-border: ${c.brandBorder};
  --text-primary: ${c.textPrimary};
  --text-secondary: ${c.textSecondary};
  --success: ${c.success};
  --warning: ${c.warning};
  --danger: ${c.danger};
  --info: ${c.info};
}`;
}
