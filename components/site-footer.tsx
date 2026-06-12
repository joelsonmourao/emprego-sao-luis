import type { Route } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { FEATURED_CITIES } from "@/lib/emprego-sao-luis-cities";
import { JOB_CATEGORIES } from "@/lib/job-categories";
import { siteConfig } from "@/lib/constants";
import { getCityJobsPath } from "@/lib/seo/jobs-pages";

export async function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,#1f2b24_0%,#1a1a1a_100%)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 text-sm text-white/78 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <SiteLogo compact withTagline={false} />
            <p className="mt-4 leading-6">
              O Emprego São Luís divulga vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão, conectando candidatos a oportunidades reais.
            </p>
            <p className="mt-4 text-xs text-white/64">{siteConfig.domain}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Navegação</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/vagas" className="hover:text-[var(--brand-orange)]">Vagas</Link>
              <Link href="/empresas" className="hover:text-[var(--brand-orange)]">Empresas</Link>
              <Link href="/categorias" className="hover:text-[var(--brand-orange)]">Categorias</Link>
              <Link href="/blog" className="hover:text-[var(--brand-orange)]">Blog</Link>
              <Link href="/anunciar-vaga" className="hover:text-[var(--brand-orange)]">Publicar vaga</Link>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Cidades</h2>
            <div className="mt-3 flex flex-col gap-2">
              {FEATURED_CITIES.slice(0, 8).map((city) => (
                <Link key={city.slug} href={getCityJobsPath(city.slug)} className="hover:text-[var(--brand-orange)]">
                  Vagas em {city.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Informações</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/sobre" className="hover:text-[var(--brand-orange)]">Sobre</Link>
              <Link href="/quem-somos" className="hover:text-[var(--brand-orange)]">Quem Somos</Link>
              <Link href="/contato" className="hover:text-[var(--brand-orange)]">Contato</Link>
              <Link href="/privacidade" className="hover:text-[var(--brand-orange)]">Política de Privacidade</Link>
              <Link href="/termos" className="hover:text-[var(--brand-orange)]">Termos de Uso</Link>
              <Link href="/cookies" className="hover:text-[var(--brand-orange)]">Política de Cookies</Link>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-xs">
              <a href="https://instagram.com/empregosaoluis" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[var(--brand-orange)]">
                <ExternalLink className="h-4 w-4" />
                Instagram {siteConfig.instagram}
              </a>
              <a href="mailto:contato@empregossaoluis.com.br" className="hover:text-[var(--brand-orange)]">
                contato@empregossaoluis.com.br
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">Categorias</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {JOB_CATEGORIES.filter((c) => c.slug !== "geral").slice(0, 8).map((category) => (
              <Link
                key={category.slug}
                href={`/vagas/categoria/${category.slug}` as Route}
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs hover:border-[var(--brand-orange)] hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/64">© {new Date().getFullYear()} Emprego São Luís. Portal de divulgação de vagas em São Luís e Maranhão.</p>
      </div>
    </footer>
  );
}
