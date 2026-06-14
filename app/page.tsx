import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, MapPinned, Newspaper, ShieldCheck, UsersRound } from "lucide-react";

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
    <div className="pb-14">
      <section className="border-b border-[var(--brand-line)] bg-[linear-gradient(180deg,#ffffff_0%,#faf8f4_100%)]">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-7 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-10 lg:px-8 lg:py-8">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--brand-brick)]">Emprego São Luís</p>
            <h1 className="text-[2rem] font-extrabold leading-tight text-[var(--brand-green)] sm:text-4xl lg:text-[2.85rem]">
              Vagas de emprego em <span className="text-[var(--brand-brick)]">São Luís</span> e no{" "}
              <span className="text-[var(--brand-brick)]">Maranhão</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--brand-text-secondary)] sm:text-base">
              Encontre oportunidades atualizadas na capital, Região Metropolitana e cidades do estado.
            </p>

            <div className="mt-4 flex justify-start lg:hidden">
              <Image
                src="/logo-horizontal.png"
                alt="Emprego São Luís"
                width={320}
                height={84}
                priority
                className="h-14 w-auto max-w-full object-contain sm:h-16"
              />
            </div>

            <div className="mt-5 w-full min-w-0 lg:mt-7">
              <HomeSearchForm
                variant="home"
                states={maranhaoStates}
                categories={homeCategories.map((item) => ({ slug: item.slug, name: item.name }))}
                fixedStateSlug={maranhaoState?.slug ?? "maranhao"}
                initialCity="sao-luis"
                action="/vagas"
                submitLabel="Buscar vagas"
                helperText="Pesquise por cargo, cidade e categoria no Maranhão."
                footerLinkHref="/vagas"
                footerLinkLabel="Ver todas as vagas"
              />
            </div>
          </div>

          <div className="relative hidden min-w-0 lg:block">
            <div className="overflow-hidden rounded-3xl border border-[rgba(123,44,40,0.18)] bg-[var(--brand-beige)] shadow-[0_24px_60px_-38px_rgba(123,44,40,0.34)]">
              <div className="flex min-h-[270px] flex-col items-center justify-center px-8 py-9">
                <Image
                  src="/logo-horizontal.png"
                  alt="Emprego São Luís"
                  width={600}
                  height={160}
                  priority
                  className="h-auto w-full max-w-[520px] object-contain"
                />
              </div>
              <div className="h-5 bg-[var(--brand-brick)]" />
            </div>
          </div>
        </div>
      </section>

      <AdUnit className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: UsersRound, title: "Vagas atualizadas", text: "Oportunidades reais de empresas de confianca." },
            { icon: ShieldCheck, title: "100% gratuito", text: "Para candidatos. Sempre." },
            { icon: MapPinned, title: "Foco em Sao Luis", text: "Capital, Regiao Metropolitana e Maranhao." },
            { icon: BriefcaseBusiness, title: "Conteudo de carreira", text: "Dicas simples para voce se destacar." }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[var(--brand-line)] bg-white p-5 shadow-[0_16px_42px_-34px_rgba(26,26,26,0.2)]">
              <item.icon className="h-8 w-8 text-[var(--brand-brick)]" />
              <p className="mt-3 text-sm font-extrabold text-[var(--brand-charcoal)]">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--brand-text-secondary)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Vagas recentes"
          title="Oportunidades publicadas recentemente"
          description="Confira vagas divulgadas em São Luís e no Maranhão com empresa, cidade e link de candidatura."
        />
        {recentJobs.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
          <Link href="/vagas">
            Ver todas as vagas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Cidades" title="Busque por cidade" description="Principais cidades do Maranhão com vagas no portal." />
        <div className="flex flex-wrap gap-2">
          {HOME_CITIES.map((city) => (
            <Link key={city.slug} href={getCityJobsPath(city.slug)} className="brand-pill">
              <MapPinned className="h-3.5 w-3.5 text-[var(--brand-brick)]" />
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Categorias" title="Vagas por área de atuação" description="Encontre oportunidades alinhadas ao seu perfil." />
        <div className="flex flex-wrap gap-2">
          {homeCategories.map((category) => (
            <Link key={category.slug} href={`/vagas/categoria/${category.slug}` as Route} className="brand-pill">
              {category.name}
            </Link>
          ))}
        </div>
        <Link href="/categorias" className="inline-flex text-sm font-semibold text-[var(--brand-brick)] hover:text-[#65231f]">
          Ver todas as categorias →
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[var(--brand-brick)] text-white shadow-[0_28px_70px_-36px_rgba(123,44,40,0.45)]">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div className="flex items-start gap-5">
              <Image
                src="/icon.png"
                alt=""
                width={88}
                height={88}
                aria-hidden
                className="hidden h-20 w-20 shrink-0 object-contain sm:block"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Para empresas</p>
                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Sua empresa está contratando?</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/88 sm:text-base">
                  Divulgue oportunidades para candidatos de São Luís, Região Metropolitana e Maranhão. Rápido, fácil e gratuito.
                </p>
              </div>
            </div>
            <Button asChild size="lg" variant="inverse" className="w-full justify-center lg:w-auto">
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
