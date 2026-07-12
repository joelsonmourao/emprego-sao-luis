import type { VisualIdentity } from "./visual-identity";
import { BRAND_COLORS, brandCssVariables } from "./brand-assets";

export const DESIGN_TOKENS = BRAND_COLORS;

export function cssVariablesFromIdentity(identity: VisualIdentity): string {
  const primary = identity.primaryColor || BRAND_COLORS.brandPrimary;
  const base = brandCssVariables();
  return base.replace(`--brand-primary: ${BRAND_COLORS.brandPrimary}`, `--brand-primary: ${primary}`);
}
