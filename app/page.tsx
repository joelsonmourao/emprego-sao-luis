import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  MapPinned,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";

import { AdUnit } from "@/components/ads/AdUnit";
import { BlogCard } from "@/components/blog-card";
import { HomeSearchForm } from "@/components/home/home-search-form";
import { JobCard } from "@/components/job-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { JOB_CATEGORIES } from "@/lib/job-categories";
import { getCategoryIcon } from "@/lib/category-icons";
import { getRecentPosts } from "@/lib/repositories/blog";
import { getRecentJobs } from "@/lib/repositories/jobs";
import { getSearchGeoData } from "@/lib/repositories/geo";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getCityJobsPath } from "@/lib/seo/jobs-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOME_CITIES = [
  { name: "São Luís", slug: "sao-luis" },
  { name: "São José de Ribamar", slug: "sao-jose-de-ribamar" },
  { name: "Paço do Lumiar", slug: "paco-do-lumiar" },
  { name: "Raposa", slug: "raposa" },
  { name: "Imperatriz", slug: "imperatriz" },
  { name: "Timon", slug: "timon" },
  { name: "Caxias", slug: "caxias" },
  { name: "Bacabal", slug: "bacabal" }
] as const;

const trustCards = [
  { title: "Vagas atualizadas", description: "Oportunidades reunidas e organizadas para facilitar sua busca.", icon: BriefcaseBusiness },
  { title: "Foco em São Luís e região", description: "Prioridade para a capital, Região Metropolitana e Maranhão.", icon: MapPinned },
  { title: "Conteúdo gratuito", description: "Consulte vagas, empresas e artigos sem pagar pelo portal.", icon: ShieldCheck },
  { title: "Por cidade e categoria", description: "Filtre por localidade e área para encontrar vagas relevantes.", icon: Users }
];

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Emprego São Luís - Vagas de Emprego em São Luís e Maranhão",
    description:
      "Encontre vagas de emprego em São Luís, Região Metropolitana e cidades do Maranhão. Oportunidades atualizadas para diversas áreas.",
    pathname: "/"
  });
}

export default async function HomePage() {
  let recentJobs: Awaited<ReturnType<typeof getRecentJobs>> = [];
  let recentPosts: Awaited<ReturnType<typeof getRecentPosts>> = [];
  let searchStates: Awaited<ReturnType<typeof getSearchGeoData>> = [];

  try {
    [recentJobs, recentPosts, searchStates] = await Promise.all([
      getRecentJobs(),
      getRecentPosts(),
      getSearchGeoData()
    ]);
  } catch (error) {
    console.error("[home] Falha ao carregar dados.", error);
  }

  const maranhaoStates = searchStates.filter((state) => state.code === "MA");
  const displayCategories = JOB_CATEGORIES.filter((item) => item.slug !== "geral");

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-[var(--brand-line)] bg-[var(--brand-green)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(242,140,27,0.2),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(123,44,40,0.16),transparent_22%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-100">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
              Gratuito para candidatos
            </div>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.65rem]">
              Vagas de emprego em São Luís e no Maranhão
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/88 sm:text-base">
              Encontre oportunidades atualizadas em São Luís, Região Metropolitana e cidades do Maranhão. Busque por cargo, filtre por cidade e candidate-se com segurança.
            </p>

            <div className="mt-8 max-w-xl rounded-2xl border border-white/12 bg-white/95 p-1 shadow-[0_24px_60px_-32px_rgba(26,26,26,0.45)]">
              <HomeSearchForm
                states={maranhaoStates.length ? maranhaoStates : searchStates}
                action="/vagas"
                submitLabel="Buscar vagas"
                helperText="Pesquise por cargo ou palavra-chave e filtre por cidade."
                footerLinkHref="/vagas"
                footerLinkLabel="Ver todas as vagas"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href="/vagas" aria-label="Ver vagas disponíveis">
                  Ver vagas disponíveis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/24 bg-white/8 text-white hover:bg-white/14">
                <Link href="/anunciar-vaga">Publicar vaga</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-3xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-8 backdrop-blur-sm">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-[var(--brand-orange)] text-4xl font-black text-white shadow-lg">
                ES
              </div>
              <p className="mt-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-orange-100">Emprego São Luís</p>
              <p className="mt-2 text-center text-sm leading-7 text-white/80">
                Portal regional de vagas com foco em São Luís, Região Metropolitana e cidades do Maranhão.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
                <div className="rounded-2xl bg-white/8 px-3 py-3 font-semibold">Vagas por cidade</div>
                <div className="rounded-2xl bg-white/8 px-3 py-3 font-semibold">Blog com dicas</div>
                <div className="rounded-2xl bg-white/8 px-3 py-3 font-semibold">Empresas locais</div>
                <div className="rounded-2xl bg-white/8 px-3 py-3 font-semibold">Anuncie grátis*</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="brand-chip es-card-hover rounded-2xl p-5">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(242,140,27,0.12)] text-[var(--brand-orange)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-extrabold text-[var(--brand-charcoal)]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <AdUnit className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Vagas recentes"
          title="Oportunidades publicadas recentemente"
          description="Confira vagas divulgadas em São Luís e no Maranhão com empresa, cidade e link de candidatura."
        />
        {recentJobs.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {recentJobs.slice(0, 6).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--brand-line)] bg-white px-6 py-10 text-sm leading-7 text-[var(--brand-text-secondary)]">
            Ainda não há vagas publicadas no momento. Volte em breve ou divulgue uma oportunidade.
          </div>
        )}
        <Button asChild size="lg" className="gap-2">
          <Link href="/vagas">Ver todas as vagas</Link>
        </Button>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Cidades" title="Busque vagas por cidade" description="Principais cidades do Maranhão com oportunidades no portal." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={getCityJobsPath(city.slug)}
              className="es-city-card es-card-hover rounded-2xl border border-[var(--brand-line)] p-5 shadow-[0_16px_40px_-30px_rgba(26,26,26,0.18)]"
            >
              <MapPinned className="h-5 w-5 text-[var(--brand-orange)]" />
              <h3 className="mt-3 text-lg font-extrabold text-[var(--brand-charcoal)]">{city.name}</h3>
              <p className="mt-1 text-sm text-[var(--brand-text-secondary)]">Ver vagas em {city.name}, MA</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Categorias" title="Vagas por área de atuação" description="Encontre oportunidades alinhadas ao seu perfil profissional." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayCategories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/vagas/categoria/${category.slug}` as Route}
                className="brand-chip es-card-hover flex items-start gap-3 rounded-2xl px-4 py-4"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(123,44,40,0.08)] text-[var(--brand-brick)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold text-[var(--brand-charcoal)]">{category.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--brand-text-secondary)]">{category.description}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/categorias">Ver todas as categorias</Link>
        </Button>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="brand-dark-panel rounded-3xl p-6 text-white sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">Para empresas</p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Sua empresa está contratando?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/86 sm:text-base">
                Divulgue oportunidades para candidatos de São Luís, Região Metropolitana e Maranhão.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="w-full justify-center lg:w-auto">
              <Link href="/anunciar-vaga">
                Publicar uma vaga
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Artigos úteis para sua carreira"
          description="Conteúdos sobre currículo, entrevista, segurança digital e mercado de trabalho no Maranhão."
        />
        {recentPosts.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {recentPosts.slice(0, 3).map((post, index) => (
              <div key={post.id} className={index === 0 ? "lg:col-span-3" : undefined}>
                <BlogCard post={post} featured={index === 0} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--brand-line)] bg-white px-6 py-10 text-sm text-[var(--brand-text-secondary)]">
            Em breve novos artigos serão publicados no blog.
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              <Newspaper className="mr-2 h-4 w-4" />
              Acessar blog
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-[var(--brand-brick)]">
            <Link href="/empresas">
              <Building2 className="mr-2 h-4 w-4" />
              Ver empresas
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="brand-panel rounded-3xl border border-[var(--brand-line)] p-6 sm:p-8">
          <SectionHeading eyebrow="Como funciona" title="Busque, compare e candidate-se com segurança" description="O Emprego São Luís organiza oportunidades — a contratação é de responsabilidade da empresa anunciante." />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "Busque por cargo, cidade ou categoria",
              "Leia descrição, requisitos e data da vaga",
              "Acesse o link oficial de candidatura"
            ].map((text) => (
              <div key={text} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-sm leading-6 text-[var(--brand-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-orange)]" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
