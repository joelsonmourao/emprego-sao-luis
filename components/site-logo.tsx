import Link from "next/link";

import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site-settings";

const FALLBACK_LOGO_HORIZONTAL = "/logo-horizontal.png";
const FALLBACK_LOGO_MARK = "/icon.png";

function isRasterLogo(path: string) {
  return /\.(png|jpe?g|webp|avif)$/i.test(path);
}

function isLegacyMinimalLogo(path: string) {
  return (
    path.endsWith(".svg") ||
    path.includes("emprego-logo") ||
    path.includes("brand-logo") ||
    path.includes("brand-mark") ||
    path.includes("jovem") ||
    path.includes("aprendiz")
  );
}

function resolveLogoPath(path: string, compact: boolean) {
  if (isRasterLogo(path) && !isLegacyMinimalLogo(path)) return path;
  return compact ? FALLBACK_LOGO_MARK : FALLBACK_LOGO_HORIZONTAL;
}

export async function SiteLogo({
  className,
  compact = false,
  withTagline = false,
  priority = false,
  inverted = false
}: {
  className?: string;
  compact?: boolean;
  withTagline?: boolean;
  priority?: boolean;
  inverted?: boolean;
}) {
  const settings = await getSiteSettings();
  const configuredPath = compact ? settings.logoCompactUrl : settings.logoUrl;
  const logoPath = resolveLogoPath(configuredPath, compact);

  return (
    <Link href="/" className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3", className)} aria-label={settings.siteName}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoPath}
        alt={settings.siteName}
        width={compact ? 96 : 527}
        height={compact ? 96 : 335}
        fetchPriority={priority ? "high" : undefined}
        className={
          compact
            ? "h-12 w-12 object-contain sm:h-14 sm:w-14"
            : inverted
              ? "h-14 w-auto max-w-[min(100%,18rem)] object-contain sm:h-16 lg:h-20 lg:max-w-[22rem]"
              : "h-14 w-auto max-w-[min(100%,18rem)] object-contain sm:h-16 lg:h-20 lg:max-w-[22rem]"
        }
      />
      {withTagline && !compact ? (
        <span className="hidden text-sm font-bold text-[var(--brand-charcoal)] lg:inline">{settings.siteName}</span>
      ) : null}
    </Link>
  );
}
