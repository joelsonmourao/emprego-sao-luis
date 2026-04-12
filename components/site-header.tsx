import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/site-logo";
import { getSiteContent } from "@/lib/site-content";

export async function SiteHeader() {
  const siteContent = await getSiteContent();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
      <div className="border-b border-[color:rgba(88,80,236,0.1)] bg-[linear-gradient(90deg,rgba(238,242,255,1)_0%,rgba(248,241,255,1)_42%,rgba(255,247,236,1)_100%)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-medium text-slate-600 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--brand-coral)]" />
            {siteContent.navigation.topBarText}
          </p>
          <Link href={siteContent.navigation.topBarLinkHref as Route} className="hidden text-[var(--brand-cobalt)] md:inline-flex">
            {siteContent.navigation.topBarLinkLabel}
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav className="hidden items-center gap-6 md:flex">
          {siteContent.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className={
                item.href === "/vagas"
                  ? "rounded-full bg-[linear-gradient(135deg,rgba(88,80,236,0.14),rgba(124,58,237,0.08))] px-4 py-2 text-sm font-semibold text-[var(--brand-cobalt)] transition hover:opacity-90"
                  : item.href === "/blog"
                    ? "rounded-full bg-[linear-gradient(135deg,rgba(255,107,87,0.12),rgba(255,215,94,0.16))] px-4 py-2 text-sm font-semibold text-[var(--brand-coral)] transition hover:opacity-90"
                    : "text-sm font-medium text-slate-700 transition hover:text-[var(--brand-cobalt)]"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="gap-2 rounded-2xl shadow-[0_18px_42px_-26px_rgba(88,80,236,0.78)] hover:opacity-95">
          <Link href={siteContent.navigation.headerCtaHref as Route}>
            {siteContent.navigation.headerCtaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="border-t border-[color:rgba(34,73,245,0.08)] md:hidden">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-3 sm:px-6">
          <div className="flex min-w-max items-center gap-3">
            {siteContent.navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={
                  item.href === "/vagas"
                    ? "rounded-full bg-[linear-gradient(135deg,rgba(88,80,236,0.14),rgba(124,58,237,0.08))] px-4 py-2 text-sm font-semibold text-[var(--brand-cobalt)]"
                    : item.href === "/blog"
                      ? "rounded-full bg-[linear-gradient(135deg,rgba(255,107,87,0.12),rgba(255,215,94,0.16))] px-4 py-2 text-sm font-semibold text-[var(--brand-coral)]"
                      : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
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
