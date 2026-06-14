import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, MapPinned, Newspaper, ShieldCheck, Sparkles, Users } from "lucide-react";

import { AdUnit } from "@/components/ads/AdUnit";
import { BlogCard } from "@/components/blog-card";
import { HomeSearchForm } from "@/components/home/home-search-form";
import { JobCard } from "@/components/job-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { JOB_CATEGORIES } from "@/lib/job-categories";
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

const HOME_CATEGORY_SLUGS = [
  "administrativo",
  "atendimento",
  "comercial",
  "operacional",
  "logistica",
  "jovem-aprendiz",
  "estagio",
  "vendas"
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

  const maranhaoState = searchStates.find((state) => state.code === "MA") ?? searchStates[0];
  const maranhaoStates = maranhaoState ? [maranhaoState] : searchStates;
  const homeCategories = HOME_CATEGORY_SLUGS.map((slug) => JOB_CATEGORIES.find((item) => item.slug === slug)).filter(
    (item): item is (typeof JOB_CATEGORIES)[number] => Boolean(item)
  );

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-[var(--brand-line)] bg-[var(--brand-green)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(242,140,27,0.22),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(123,44,40,0.18),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--brand-brick)] via-[var(--brand-orange)] to-[var(--brand-brick)]" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-8 lg:py-12">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-100">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
              Gratuito para candidatos
            </div>
            <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight sm:text-4xl lg:text-[2.5rem]">
              Vagas de emprego em São Luís e no Maranhão
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/88 sm:text-base">
              Encontre oportunidades atualizadas na capital, Região Metropolitana e cidades do estado.
            </p>

            <div className="mt-4 flex justify-center lg:hidden">
              <Image
                src="/logo-horizontal.png"
                alt="Emprego São Luís"
                width={280}
                height={72}
                priority
                className="h-12 w-auto max-w-[min(100%,16rem)] object-contain sm:h-14"
              />
            </div>

            <div className="mt-5 w-full min-w-0 lg:mt-6">
              <HomeSearchForm
                variant="home"
                states={maranhaoStates}
                categories={homeCategories.map((item) => ({ slug: item.slug, name: item.name }))}
                fixedStateSlug={maranhaoState?.slug ?? "maranhao"}
                action="/vagas"
                submitLabel="Buscar vagas"
                helperText="Pesquise por cargo, cidade e categoria no Maranhão."
                footerLinkHref="/vagas"
                footerLinkLabel="Ver todas as vagas"
              />
            </div>
          </div>

          <div className="relative hidden min-w-0 lg:block">
            <div className="overflow-hidden rounded-3xl border border-white/14 bg-[var(--brand-beige)] text-[var(--brand-charcoal)] shadow-[0_28px_70px_-36px_rgba(26,26,26,0.55)]">
              <div className="h-1.5 bg-gradient-to-r from-[var(--brand-brick)] via-[var(--brand-orange)] to-[var(--brand-brick)]" />
              <div className="p-5 sm:p-6 lg:p-7">
                <div className="relative mx-auto max-w-sm lg:max-w-none">
                  <Image
                    src="/logo-horizontal.png"
                    alt="Emprego São Luís"
                    width={560}
                    height={148}
                    priority
                    className="h-auto w-full object-contain"
                  />
                </div>
                <p className="mt-5 text-center text-xl font-extrabold text-[var(--brand-brick)] sm:text-2xl">Temos vagas para você</p>
                <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-[var(--brand-text-secondary)]">
                  Portal regional com foco em São Luís, Região Metropolitana e cidades do Maranhão.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["Vagas por cidade", "Blog com dicas", "Empresas locais"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-[rgba(123,44,40,0.14)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--brand-brick)]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="brand-chip es-card-hover overflow-hidden rounded-2xl p-5">
                <div className="h-1 w-12 rounded-full bg-[var(--brand-orange)]" />
                <div className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(242,140,27,0.12)] text-[var(--brand-orange)]">
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

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
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
        <Button asChild size="lg" variant="secondary" className="gap-2">
          <Link href="/vagas">
            Ver todas as vagas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cidades"
          title="Busque por cidade"
          description="Principais cidades do Maranhão com vagas no portal."
        />
        <div className="flex flex-wrap gap-2">
          {HOME_CITIES.map((city) => (
            <Link key={city.slug} href={getCityJobsPath(city.slug)} className="brand-pill">
              <MapPinned className="h-3.5 w-3.5 text-[var(--brand-orange)]" />
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Categorias"
          title="Vagas por área de atuação"
          description="Encontre oportunidades alinhadas ao seu perfil."
        />
        <div className="flex flex-wrap gap-2">
          {homeCategories.map((category) => (
            <Link key={category.slug} href={`/vagas/categoria/${category.slug}` as Route} className="brand-pill">
              {category.name}
            </Link>
          ))}
        </div>
        <Link href="/categorias" className="inline-flex text-sm font-semibold text-[var(--brand-brick)] hover:text-[var(--brand-orange)]">
          Ver todas as categorias →
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="brand-dark-panel overflow-hidden rounded-3xl p-6 text-white sm:p-10">
          <div className="h-1 w-16 rounded-full bg-[var(--brand-orange)]" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">Para empresas</p>
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

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Artigos úteis para sua carreira"
          description="Conteúdos sobre currículo, entrevista e mercado de trabalho no Maranhão."
        />
        {recentPosts.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {recentPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--brand-line)] bg-white px-6 py-10 text-sm text-[var(--brand-text-secondary)]">
            Em breve novos artigos serão publicados no blog.
          </div>
        )}
        <Button asChild variant="outline" size="lg">
          <Link href="/blog">
            <Newspaper className="mr-2 h-4 w-4" />
            Acessar blog
          </Link>
        </Button>
      </section>
    </div>
  );
}
