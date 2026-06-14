import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/site-logo";
import { siteConfig } from "@/lib/constants";

const navItems = [
  { href: "/vagas", label: "Vagas" },
  { href: "/empresas", label: "Empresas" },
  { href: "/categorias", label: "Categorias" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" }
] as const;

export async function SiteHeader() {
  return (
    <header className="z-40 border-b border-white/10 bg-[var(--brand-green)] text-white shadow-[0_12px_40px_-24px_rgba(26,26,26,0.55)] md:sticky md:top-0">
      <div className="h-1 bg-gradient-to-r from-[var(--brand-brick)] via-[var(--brand-orange)] to-[var(--brand-brick)]" />
      <div className="border-b border-white/8 bg-[linear-gradient(90deg,#1f2b24_0%,#243328_55%,#1a1a1a_100%)]">
        <div className="mx-auto flex min-h-[34px] max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[11px] text-white/80 sm:px-6 lg:px-8">
          <p className="line-clamp-1 font-medium">Portal de vagas em São Luís e Maranhão · Gratuito para candidatos</p>
          <a
            href="https://instagram.com/empregosaoluis"
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram ${siteConfig.instagram}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-3 py-1 font-semibold text-white transition hover:border-[var(--brand-orange)]/40 hover:text-[var(--brand-orange)]"
          >
            <Instagram className="h-3.5 w-3.5" />
            {siteConfig.instagram}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <SiteLogo className="min-w-0 shrink" withTagline={false} priority />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu principal">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className={
                item.href === "/vagas"
                  ? "rounded-xl bg-white px-4 py-2 text-sm font-bold text-[var(--brand-green)] shadow-sm"
                  : "rounded-xl px-4 py-2 text-sm font-medium text-white/88 transition hover:bg-white/10 hover:text-white"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://instagram.com/empregosaoluis"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Emprego São Luís"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/6 text-white transition hover:border-[var(--brand-orange)]/40 hover:text-[var(--brand-orange)] lg:hidden"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <Button asChild size="sm" className="gap-1.5 rounded-xl bg-[var(--brand-orange)] px-4 text-sm font-bold hover:bg-[var(--brand-orange-strong)]">
            <Link href="/anunciar-vaga" aria-label="Publicar vaga no portal">
              Publicar vaga
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-white/8 lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <nav className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1" aria-label="Menu mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as Route}
                className={
                  item.href === "/vagas"
                    ? "whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--brand-green)]"
                    : "whitespace-nowrap rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-[11px] font-medium text-white/86"
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
