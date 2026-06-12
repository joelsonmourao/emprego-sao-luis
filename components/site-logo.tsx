import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site-settings";

const BRAND_LOGO_PATHS = new Set([
  "/logo.png",
  "/logo-horizontal.png",
  "/brand-logo.svg",
  "/brand-mark.svg",
  "/logo.svg",
  "/emprego-logo-horizontal.svg",
  "/emprego-logo-mark.svg"
]);

export async function SiteLogo({
  className,
  compact = false,
  withTagline = true,
  priority = false
}: {
  className?: string;
  compact?: boolean;
  withTagline?: boolean;
  priority?: boolean;
}) {
  const settings = await getSiteSettings();
  const logoPath = compact ? settings.logoCompactUrl : settings.logoUrl;
  const useBrandComponent = BRAND_LOGO_PATHS.has(logoPath) || logoPath.includes("jovem") || logoPath.includes("aprendiz");

  return (
    <Link href="/" className={cn("flex min-w-0 items-center gap-2.5 sm:gap-3", className)} aria-label={settings.siteName}>
      {useBrandComponent ? (
        <>
          <BrandLogo variant={compact ? "mark" : "horizontal"} />
          {compact && withTagline ? (
            <div className="hidden min-w-0 sm:block">
              <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--brand-orange)]">Maranhão</div>
              <div className="text-base font-black tracking-tight text-white">{settings.siteName}</div>
            </div>
          ) : null}
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoPath}
          alt={settings.siteName}
          width={compact ? 52 : 260}
          height={compact ? 52 : 68}
          fetchPriority={priority ? "high" : undefined}
          className={compact ? "h-12 w-12 object-contain" : "h-9 w-auto max-w-full sm:h-12 lg:h-14"}
        />
      )}
    </Link>
  );
}
