import type { Route } from "next";
import Link from "next/link";
import { Building2, Compass, ExternalLink, FileText, Sparkles, Mail, Phone, MessageCircle } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export async function SiteFooter() {
  const [siteContent, settings] = await Promise.all([getSiteContent(), getSiteSettings()]);
  const socialLabels: Record<keyof typeof settings.socialLinks, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    tiktok: "TikTok"
  };

  return (
    <footer className="border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6f9ff_42%,#eef4ff_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 text-sm text-slate-600 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <SiteLogo compact withTagline={false} />
            <p className="mt-4 leading-6">{siteContent.footer.description}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Navegacao</h2>
            <div className="mt-3 flex flex-col gap-2">
              {siteContent.navigation.main.slice(0, 4).map((item) => (
                <Link key={item.href} href={item.href as Route}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Informacoes</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/sobre">Sobre</Link>
              <Link href="/contato">Contato</Link>
              <Link href="/politica-de-privacidade">Politica de Privacidade</Link>
              <Link href="/politica-de-cookies">Politica de Cookies</Link>
              <Link href="/termos-de-uso">Termos de Uso</Link>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Atalhos uteis</h2>
            <div className="mt-3 space-y-3">
              <p className="inline-flex items-center gap-2"><Compass className="h-4 w-4 text-[var(--brand-cobalt)]" /> Buscar por cidade e estado</p>
              <p className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-[var(--brand-cobalt)]" /> Ver empresas com vagas</p>
              <p className="inline-flex items-center gap-2"><FileText className="h-4 w-4 text-[var(--brand-cobalt)]" /> Ler dicas de curriculo e entrevista</p>
              <p className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--brand-coral)]" /> Acompanhar novas oportunidades</p>
            </div>
          </div>
        </div>
        {(settings.email || settings.phone || settings.whatsapp) ? (
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
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
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition hover:text-[var(--brand-cobalt)]"
                >
                  <ExternalLink className="h-4 w-4" />
                  {socialLabels[key as keyof typeof settings.socialLinks]}
                </a>
              ) : null
            )}
          </div>
        ) : null}
        <p className="text-xs text-slate-500">{siteContent.footer.copyrightText}</p>
      </div>
    </footer>
  );
}
