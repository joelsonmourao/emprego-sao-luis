import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/site-logo";
import { getSiteContent } from "@/lib/site-content";

export async function SiteHeader() {
  const siteContent = await getSiteContent();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:rgba(255,255,255,0.08)] bg-[var(--brand-navy)] text-white shadow-[0_18px_50px_-35px_rgba(26,43,76,0.7)] backdrop-blur-2xl">
      <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgba(26,43,76,0.98)_0%,rgba(34,56,99,0.98)_58%,rgba(47,111,237,0.92)_100%)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-medium text-white/78 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--brand-orange)]" />
            {siteContent.navigation.topBarText}
          </p>
          <Link href={siteContent.navigation.topBarLinkHref as Route} className="hidden text-white md:inline-flex hover:text-[var(--brand-orange)]">
            {siteContent.navigation.topBarLinkLabel}
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav className="hidden items-center gap-3 md:flex">
          {siteContent.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className={
                item.href === "/vagas"
                  ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] transition hover:bg-[var(--brand-soft)]"
                  : item.href === "/blog"
                    ? "rounded-full border border-[rgba(255,109,0,0.28)] bg-[rgba(255,109,0,0.14)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[rgba(255,109,0,0.2)]"
                    : "rounded-full px-4 py-2 text-sm font-medium text-white/82 transition hover:bg-white/10 hover:text-white"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="gap-2 rounded-2xl">
          <Link href={siteContent.navigation.headerCtaHref as Route}>
            {siteContent.navigation.headerCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="border-t border-white/10 md:hidden">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3 sm:px-6">
          <div className="flex min-w-max items-center gap-3">
            {siteContent.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={
                  item.href === "/vagas"
                    ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)]"
                    : item.href === "/blog"
                      ? "rounded-full border border-[rgba(255,109,0,0.28)] bg-[rgba(255,109,0,0.14)] px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white/82"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
