import type { VisualIdentity } from "./visual-identity";
import { BRAND_COLORS, brandCssVariables } from "./brand-assets";
import type { BrandPalette } from "./brand/constants";

export const DESIGN_TOKENS = BRAND_COLORS;

export function cssVariablesFromIdentity(identity: VisualIdentity, palette?: Partial<BrandPalette>): string {
  const p = palette ?? {};
  const primary = p.brandPrimary ?? identity.primaryColor ?? BRAND_COLORS.brandPrimary;
  const base = brandCssVariables();
  return base
    .replace(`--brand-primary: ${BRAND_COLORS.brandPrimary}`, `--brand-primary: ${primary}`)
    .replace(`--brand-primary-hover: ${BRAND_COLORS.brandPrimaryHover}`, `--brand-primary-hover: ${p.brandPrimaryHover ?? BRAND_COLORS.brandPrimaryHover}`)
    .replace(`--brand-secondary: ${BRAND_COLORS.brandSecondary}`, `--brand-secondary: ${p.brandSecondary ?? BRAND_COLORS.brandSecondary}`)
    .replace(`--brand-accent: ${BRAND_COLORS.brandAccent}`, `--brand-accent: ${p.brandAccent ?? BRAND_COLORS.brandAccent}`)
    .replace(`--brand-accent-warm: ${BRAND_COLORS.brandAccentWarm}`, `--brand-accent-warm: ${p.brandAccentWarm ?? BRAND_COLORS.brandAccentWarm}`)
    .replace(`--brand-background: ${BRAND_COLORS.brandBackground}`, `--brand-background: ${p.brandBackground ?? BRAND_COLORS.brandBackground}`)
    .replace(`--brand-surface: ${BRAND_COLORS.brandSurface}`, `--brand-surface: ${p.brandSurface ?? BRAND_COLORS.brandSurface}`)
    .replace(`--brand-border: ${BRAND_COLORS.brandBorder}`, `--brand-border: ${p.brandBorder ?? BRAND_COLORS.brandBorder}`)
    .replace(`--text-primary: ${BRAND_COLORS.textPrimary}`, `--text-primary: ${p.textPrimary ?? BRAND_COLORS.textPrimary}`)
    .replace(`--text-secondary: ${BRAND_COLORS.textSecondary}`, `--text-secondary: ${p.textSecondary ?? BRAND_COLORS.textSecondary}`);
}
