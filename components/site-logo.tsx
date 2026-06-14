import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site-settings";

const BRAND_SVG_PATHS = new Set([
  "/brand-logo.svg",
  "/brand-mark.svg",
  "/logo.svg",
  "/emprego-logo-horizontal.svg",
  "/emprego-logo-mark.svg"
]);

function isRasterLogo(path: string) {
  return /\.(png|jpe?g|webp|avif)$/i.test(path);
}

export async function SiteLogo({
  className,
  compact = false,
  withTagline = false,
  priority = false
}: {
  className?: string;
  compact?: boolean;
  withTagline?: boolean;
  priority?: boolean;
}) {
  const settings = await getSiteSettings();
  const logoPath = compact ? settings.logoCompactUrl : settings.logoUrl;
  const useRasterLogo = isRasterLogo(logoPath);
  const useBrandSvg = !useRasterLogo && BRAND_SVG_PATHS.has(logoPath);

  return (
    <Link href="/" className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3", className)} aria-label={settings.siteName}>
      {useRasterLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoPath}
          alt={settings.siteName}
          width={compact ? 56 : 320}
          height={compact ? 56 : 80}
          fetchPriority={priority ? "high" : undefined}
          className={
            compact
              ? "h-11 w-11 object-contain sm:h-12 sm:w-12"
              : "h-11 w-auto max-w-[min(100%,18rem)] object-contain sm:h-14 sm:max-w-[20rem] lg:h-16 lg:max-w-[22rem]"
          }
        />
      ) : useBrandSvg ? (
        <BrandLogo variant={compact ? "mark" : "horizontal"} className={compact ? "h-11 w-11 sm:h-12 sm:w-12" : "h-11 sm:h-14 lg:h-16"} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoPath}
          alt={settings.siteName}
          width={compact ? 56 : 320}
          height={compact ? 56 : 80}
          fetchPriority={priority ? "high" : undefined}
          className={
            compact
              ? "h-11 w-11 object-contain sm:h-12 sm:w-12"
              : "h-11 w-auto max-w-[min(100%,18rem)] object-contain sm:h-14 sm:max-w-[20rem] lg:h-16 lg:max-w-[22rem]"
          }
        />
      )}
      {withTagline && !compact ? (
        <span className="hidden text-sm font-bold text-white/90 lg:inline">{settings.siteName}</span>
      ) : null}
    </Link>
  );
}
