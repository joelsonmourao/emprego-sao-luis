import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/site-logo";

const navItems = [
  { href: "/vagas", label: "Vagas" },
  { href: "/empresas", label: "Empresas" },
  { href: "/categorias", label: "Categorias" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" }
] as const;

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--brand-line)] bg-white/96 text-[var(--brand-charcoal)] shadow-[0_10px_35px_-26px_rgba(26,26,26,0.22)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8 lg:py-3">
        <SiteLogo className="min-w-0 shrink-0" withTagline={false} priority />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className={
                item.href === "/vagas"
                  ? "px-4 py-2 text-sm font-bold text-[var(--brand-brick)] underline decoration-[var(--brand-brick)] decoration-2 underline-offset-8"
                  : "px-4 py-2 text-sm font-semibold text-[var(--brand-charcoal)] transition hover:text-[var(--brand-brick)]"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="h-11 shrink-0 gap-1.5 rounded-xl px-4 text-sm font-bold shadow-[0_16px_34px_-20px_rgba(123,44,40,0.65)] sm:px-5">
          <Link href="/anunciar-vaga" aria-label="Publicar vaga no portal">
            Publicar vaga
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="border-t border-[var(--brand-line)] lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1" aria-label="Menu mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={
                  item.href === "/vagas"
                    ? "whitespace-nowrap rounded-full border border-[rgba(123,44,40,0.2)] bg-[rgba(123,44,40,0.06)] px-3 py-1.5 text-[11px] font-bold text-[var(--brand-brick)]"
                    : "whitespace-nowrap rounded-full border border-[var(--brand-line)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--brand-charcoal)]"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
