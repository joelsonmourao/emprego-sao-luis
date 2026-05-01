import type { Route } from "next";
import Link from "next/link";
import { Building2, Compass, ExternalLink, FileText, Sparkles, Mail, Phone, MessageCircle, ArrowRight } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export async function SiteFooter() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);
  const navItems = siteContent.navigation.main.some((item) => item.href === "/menor-aprendiz")
    ? siteContent.navigation.main
    : [...siteContent.navigation.main, { href: "/menor-aprendiz", label: "Menor Aprendiz" }];
  const shortcutIconMap = {
    compass: Compass,
    handshake: Building2,
    "file-text": FileText,
    target: ArrowRight
  } as const;
  const socialLabels: Record<keyof typeof settings.socialLinks, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok"
  };

  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,#1a2b4c_0%,#20355c_44%,#172741_100%)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 text-sm text-white/78 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <SiteLogo compact withTagline={false} />
            <p className="mt-4 leading-6">{siteContent.footer.description}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{siteContent.footer.navigationTitle}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {navItems.slice(0, 5).map((item) => (
                <Link key={item.href} href={item.href as Route} className="hover:text-[var(--brand-orange)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{siteContent.footer.informationTitle}</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/sobre" className="hover:text-[var(--brand-orange)]">Sobre</Link>
              <Link href="/contato" className="hover:text-[var(--brand-orange)]">Contato</Link>
              <Link href="/politica-de-privacidade" className="hover:text-[var(--brand-orange)]">Política de Privacidade</Link>
              <Link href="/politica-de-cookies" className="hover:text-[var(--brand-orange)]">Política de Cookies</Link>
              <Link href="/termos-de-uso" className="hover:text-[var(--brand-orange)]">Termos de Uso</Link>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{siteContent.footer.shortcutsTitle}</h2>
            <div className="mt-3 space-y-3">
              {siteContent.footer.shortcuts.map((item, index) => {
                const Icon = shortcutIconMap[item.iconKey as keyof typeof shortcutIconMap] ?? Sparkles;

                return (
                  <div key={`${item.title}-${index}`} className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3 shadow-sm">
                    <p className="inline-flex items-center gap-2 font-semibold text-white">
                      <Icon className="h-4 w-4 text-[var(--brand-orange)]" />
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-white/72">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {(settings.email || settings.phone || settings.whatsapp) ? (
          <div className="flex flex-wrap gap-4 text-xs text-white/72">
            {settings.email ? <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {settings.email}</span> : null}
            {settings.phone ? <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> {settings.phone}</span> : null}
            {settings.whatsapp ? <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> {settings.whatsapp}</span> : null}
          </div>
        ) : null}
        {Object.values(settings.socialLinks).some(Boolean) ? (
          <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(settings.socialLinks).map(([key, value]) =>
              value ? (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 font-medium text-white/82 transition hover:border-[var(--brand-orange)] hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  {socialLabels[key as keyof typeof settings.socialLinks]}
                </a>
              ) : null
            )}
          </div>
        ) : null}
        <p className="text-xs text-white/64">{siteContent.footer.copyrightText}</p>
      </div>
    </footer>
  );
}
