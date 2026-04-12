import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/lib/site-settings";

export async function SiteLogo({
  className,
  compact = false,
  withTagline = true
}: {
  className?: string;
  compact?: boolean;
  withTagline?: boolean;
}) {
  const settings = await getSiteSettings();

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <Image
        src={compact ? settings.logoCompactUrl : settings.logoUrl}
        alt={settings.siteName}
        width={compact ? 52 : 260}
        height={compact ? 52 : 68}
        priority
        className={compact ? "h-12 w-12" : "h-14 w-auto"}
      />
      {compact && withTagline ? (
        <div className="hidden min-w-0 sm:block">
          <div className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--brand-orange)]">Primeiro emprego</div>
          <div className="text-base font-black tracking-tight text-[var(--brand-navy)]">{settings.siteName}</div>
        </div>
      ) : null}
    </Link>
  );
}
