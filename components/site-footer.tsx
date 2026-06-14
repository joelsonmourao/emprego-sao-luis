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
            <div className="inline-flex rounded-2xl bg-white/96 px-3 py-2">
              <SiteLogo withTagline={false} />
            </div>
            <p className="mt-4 leading-6">
              O Emprego São Luís divulga vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão, conectando candidatos a oportunidades reais.
            </p>
            <p className="mt-4 text-xs text-white/64">{siteConfig.domain}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Navegação</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/vagas" className="hover:text-white">Vagas</Link>
              <Link href="/empresas" className="hover:text-white">Empresas</Link>
              <Link href="/categorias" className="hover:text-white">Categorias</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/anunciar-vaga" className="hover:text-white">Publicar vaga</Link>
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Cidades</h2>
            <div className="mt-3 flex flex-col gap-2">
              {FEATURED_CITIES.slice(0, 8).map((city) => (
                <Link key={city.slug} href={getCityJobsPath(city.slug)} className="hover:text-white">
                  Vagas em {city.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Informações</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/sobre" className="hover:text-white">Sobre</Link>
              <Link href="/quem-somos" className="hover:text-white">Quem Somos</Link>
              <Link href="/contato" className="hover:text-white">Contato</Link>
              <Link href="/privacidade" className="hover:text-white">Política de Privacidade</Link>
              <Link href="/termos" className="hover:text-white">Termos de Uso</Link>
              <Link href="/cookies" className="hover:text-white">Política de Cookies</Link>
            </div>
            <div className="mt-4 flex flex-col gap-2 text-xs">
              <a href="https://instagram.com/empregosaoluis" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <ExternalLink className="h-4 w-4" />
                Instagram {siteConfig.instagram}
              </a>
              <a href="mailto:contato@empregossaoluis.com.br" className="hover:text-white">
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
                className="rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs hover:border-white/24 hover:text-white"
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
