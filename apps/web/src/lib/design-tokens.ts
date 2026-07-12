import type { VisualIdentity } from "./visual-identity";

export const DESIGN_TOKENS = {
  wine: "#7A1F2B",
  wineLight: "#9B2D3A",
  cream: "#FAF7F2",
  creamDark: "#F0E9DF",
  green: "#1A3C34",
  ink: "#1C1917",
  muted: "#57534E",
  border: "#E7E0D8",
  shadow: "0 8px 30px rgba(28, 25, 23, 0.06)"
} as const;

export function cssVariablesFromIdentity(identity: VisualIdentity): string {
  const primary = identity.primaryColor || DESIGN_TOKENS.wine;
  return `:root {
  --brand-primary: ${primary};
  --es-wine: ${primary};
  --es-wine-light: ${DESIGN_TOKENS.wineLight};
  --es-cream: ${DESIGN_TOKENS.cream};
  --es-cream-dark: ${DESIGN_TOKENS.creamDark};
  --es-green: ${DESIGN_TOKENS.green};
  --es-ink: ${DESIGN_TOKENS.ink};
  --es-muted: ${DESIGN_TOKENS.muted};
  --es-border: ${DESIGN_TOKENS.border};
  --es-shadow: ${DESIGN_TOKENS.shadow};
}`;
}
