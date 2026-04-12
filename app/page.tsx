import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Newspaper,
  TrendingUp
} from "lucide-react";

import { AdSlot } from "@/components/ad-slot";
import { BlogCard } from "@/components/blog-card";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JobSearchForm } from "@/components/job-search-form";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getPostsBySlugs, getRecentPosts } from "@/lib/repositories/blog";
import { getFeaturedCompanies, getFeaturedCompaniesBySlugs, getFeaturedJobs, getJobsBySlugs } from "@/lib/repositories/jobs";
import { getCities, getCitiesBySlugs, getSearchGeoData, getStates, getStatesBySlugs } from "@/lib/repositories/geo";
import { getSiteContent } from "@/lib/site-content";
import { homeBlockKeys } from "@/lib/schemas/site-admin";

export async function generateMetadata() {
  return buildSiteMetadata({
    title: "Jovem Aprendiz Vagas no Brasil",
    description: "Encontre vagas de Jovem Aprendiz por cidade e estado, veja empresas que contratam e acesse dicas para curriculo, entrevista e primeiro emprego.",
    pathname: "/"
  });
}

const iconMap = {
  compass: Building2,
  "file-text": BookOpenText,
  messages: Newspaper,
  briefcase: BriefcaseBusiness,
  graduation: GraduationCap,
  trending: TrendingUp,
  handshake: Newspaper,
  target: ArrowRight
} as const;

export default async function HomePage() {
  const [
    featuredJobsDefault,
    recentPostsDefault,
    statesDefault,
    citiesDefault,
    searchStates,
    companiesDefault,
    siteContent
  ] = await Promise.all([
    getFeaturedJobs(),
    getRecentPosts(),
    getStates(),
    getCities(),
    getSearchGeoData(),
    getFeaturedCompanies(),
    getSiteContent()
  ]);

  const [featuredJobsSelected, featuredPostsSelected, featuredStatesSelected, featuredCitiesSelected, featuredCompaniesSelected] =
    await Promise.all([
      getJobsBySlugs(siteContent.home.featured.jobSlugs),
      getPostsBySlugs(siteContent.home.featured.postSlugs),
      getStatesBySlugs(siteContent.home.featured.stateSlugs),
      getCitiesBySlugs(siteContent.home.featured.citySlugs),
      getFeaturedCompaniesBySlugs(siteContent.home.featured.companySlugs)
    ]);

  const featuredJobs = featuredJobsSelected.length ? featuredJobsSelected : featuredJobsDefault;
  const recentPosts = featuredPostsSelected.length ? featuredPostsSelected : recentPostsDefault;
  const states = featuredStatesSelected.length ? featuredStatesSelected : statesDefault;
  const cities = featuredCitiesSelected.length ? featuredCitiesSelected : citiesDefault;
  const companies = featuredCompaniesSelected.length ? featuredCompaniesSelected : companiesDefault;
  const sectionsEnabled = siteContent.home.blocks;
  const validOrder = siteContent.home.blockOrder.filter((key) => homeBlockKeys.includes(key));
  const orderedBlocks = [...validOrder, ...homeBlockKeys.filter((key) => !validOrder.includes(key))];

  const pageSections: Record<(typeof homeBlockKeys)[number], ReactNode> = {
    quickAccess: (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Link href="/vagas" className="brand-chip rounded-[2rem] p-7 transition hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-cobalt)]">
                  {siteContent.home.quickJobsEyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-black text-slate-950">{siteContent.home.quickJobsTitle}</h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">{siteContent.home.quickJobsDescription}</p>
              </div>
              <BriefcaseBusiness className="h-10 w-10 text-[var(--brand-cobalt)]" />
            </div>
          </Link>

          <Link
            href="/blog"
            className="rounded-[2rem] border border-[color:rgba(88,80,236,0.14)] bg-[linear-gradient(145deg,#1f1c54_0%,#3340a7_54%,#2563eb_100%)] p-7 text-white shadow-[0_30px_90px_-55px_rgba(31,28,84,0.7)] transition hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-100">
                  {siteContent.home.quickBlogEyebrow}
                </p>
                <h2 className="mt-3 text-3xl font-black">{siteContent.home.quickBlogTitle}</h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-white/86">{siteContent.home.quickBlogDescription}</p>
              </div>
              <Newspaper className="h-10 w-10 text-[var(--brand-sun)]" />
            </div>
          </Link>
        </div>
      </section>
    ),
    featuredJobs: (
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-8">
          <SectionHeading eyebrow="Vagas em destaque" title={siteContent.home.featuredTitle} description={siteContent.home.featuredDescription} />
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/vagas">
                Ver todas as vagas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-6">
          <AdSlot className="min-h-64 rounded-[2rem]" label="Espaco AdSense 300x600" />
          <div className="brand-chip rounded-[2rem] p-6">
            <h2 className="text-lg font-black text-slate-950">Estados em destaque</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {states.slice(0, 8).map((state) => (
                <Link
                  key={state.id}
                  href={`/vagas/estado/${state.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-[var(--brand-cobalt)]"
                >
                  {state.name} ({state._count.jobs})
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    ),
    blog: (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Blog" title={siteContent.home.blogTitle} description={siteContent.home.blogDescription} />
        <div className="grid gap-6 lg:grid-cols-3">
          {recentPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl border-[color:rgba(34,73,245,0.2)] text-[var(--brand-cobalt)] hover:bg-[var(--brand-mist)]"
          >
            <Link href="/blog">Acessar blog</Link>
          </Button>
        </div>
      </section>
    ),
    howItWorks: (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {siteContent.home.howItWorksSteps.map((step) => {
            const Icon = iconMap[step.iconKey as keyof typeof iconMap] ?? Building2;

            return (
              <div key={step.title} className="brand-chip rounded-[1.75rem] p-6">
                <Icon className="h-7 w-7 text-[var(--brand-cobalt)]" />
                <h2 className="mt-4 text-2xl font-black text-slate-950">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
    citiesAndBenefits: (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="brand-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_90px_-50px_rgba(2,132,199,0.35)]">
            <SectionHeading
              eyebrow="Cidades em destaque"
              title="Navegue por localidade"
              description="Escolha a sua cidade ou estado para ver vagas mais perto de voce."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              {cities.slice(0, 8).map((city) => (
                <Link
                  key={city.id}
                  href={`/vagas/estado/${city.state.slug}/${city.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-[var(--brand-cobalt)]"
                >
                  {city.name}, {city.state.code}
                </Link>
              ))}
            </div>
          </div>

          <div className="brand-dark-panel rounded-[2rem] p-8 text-white shadow-[0_30px_100px_-50px_rgba(31,28,84,0.8)]">
            <SectionHeading
              eyebrow="Beneficios do programa"
              title="Por que o Jovem Aprendiz faz tanta diferenca"
              description="Veja por que esse programa pode abrir portas para o seu primeiro emprego."
              tone="light"
            />
            <div className="mt-6 grid gap-5">
              {siteContent.home.benefits.slice(0, 3).map((item) => {
                const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? GraduationCap;

                return (
                  <div key={item.title} className="rounded-[1.5rem] border border-white/20 bg-white/12 p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.5)] backdrop-blur">
                    <Icon className="h-7 w-7 text-[var(--brand-sun)]" />
                    <h3 className="mt-4 text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/88">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    ),
    careerCtas: (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {siteContent.home.careerCtas.map((item) => {
            const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? ArrowRight;

            return (
              <Link key={item.title} href={item.href as Route} className="brand-chip rounded-[2rem] p-6 transition hover:-translate-y-1">
                <Icon className="h-8 w-8 text-[var(--brand-coral)]" />
                <h3 className="mt-5 text-2xl font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    ),
    companies: (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="brand-chip rounded-[2rem] p-6">
            <h2 className="text-lg font-black text-slate-950">Empresas que contratam</h2>
            <div className="mt-5 grid gap-3">
              {companies.slice(0, 6).map((company) => (
                <Link
                  key={company.slug}
                  href={`/empresas/${company.slug}`}
                  className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 transition hover:text-[var(--brand-cobalt)]"
                >
                  <span className="block font-semibold text-slate-950">{company.name}</span>
                  <span className="mt-1 block text-slate-500">
                    {company.city.name}, {company.state.code}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-[var(--brand-cobalt)]">
                    {company._count.jobs} vaga(s) publicada(s)
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <AdSlot className="min-h-44 rounded-[2rem]" label="Espaco AdSense horizontal" />
        </div>
      </section>
    ),
    faq: (
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="FAQ" title={siteContent.home.faqTitle} description={siteContent.home.faqDescription} />
        <FaqList />
      </section>
    ),
    finalCta: (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-[linear-gradient(135deg,#1a184d_0%,#343ca3_42%,#5850ec_70%,#2563eb_100%)] p-8 text-white">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-100">{siteContent.home.finalCtaEyebrow}</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight">{siteContent.home.finalCtaTitle}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/86">{siteContent.home.finalCtaDescription}</p>
            </div>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
                <Link href={siteContent.home.primaryButton.href as Route}>{siteContent.home.primaryButton.label}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                <Link href={siteContent.home.secondaryButton.href as Route}>{siteContent.home.secondaryButton.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  };

  return (
    <div className="pb-20">
      <JsonLd data={buildFaqJsonLd(siteContent.faq.home)} />
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#17153f_0%,#2f2d7c_28%,#5850ec_62%,#2563eb_82%,#ff6b57_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.16),transparent_16%),radial-gradient(circle_at_88%_14%,rgba(255,215,94,0.18),transparent_14%),radial-gradient(circle_at_72%_80%,rgba(255,255,255,0.12),transparent_18%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-18 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-22">
          <div className="relative space-y-8">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-50">
              {siteContent.home.heroBadge}
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl xl:text-7xl">{siteContent.home.heroTitle}</h1>
              <p className="max-w-3xl text-lg leading-8 text-white/86">{siteContent.home.heroDescription}</p>
            </div>

            <JobSearchForm
              states={searchStates}
              action="/vagas"
              submitLabel="Ver vagas"
              helperText={siteContent.home.searchHelperText}
              footerLinkHref="/vagas"
              footerLinkLabel="Abrir todas as vagas"
            />

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href={siteContent.home.primaryButton.href as Route}>
                  {siteContent.home.primaryButton.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/16">
                <Link href={siteContent.home.secondaryButton.href as Route}>{siteContent.home.secondaryButton.label}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="mesh-surface rounded-[2.5rem] border border-white/20 p-6 shadow-[0_40px_120px_-50px_rgba(8,47,73,0.75)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/vagas" className="rounded-[1.75rem] bg-white p-5 text-slate-900 shadow-sm transition hover:-translate-y-1">
                  <BriefcaseBusiness className="h-8 w-8 text-[var(--brand-cobalt)]" />
                  <h2 className="mt-4 text-xl font-black">Onde ver vagas</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Listagens claras com localidade, filtros e cards objetivos.</p>
                </Link>
                <Link href="/blog" className="rounded-[1.75rem] bg-[linear-gradient(145deg,#1f1c54_0%,#3340a7_54%,#2563eb_100%)] p-5 text-white shadow-sm transition hover:-translate-y-1">
                  <BookOpenText className="h-8 w-8 text-[var(--brand-sun)]" />
                  <h2 className="mt-4 text-xl font-black">Onde acessar o blog</h2>
                  <p className="mt-2 text-sm leading-6 text-white/82">Conteudos sobre curriculo, entrevista e primeiro emprego.</p>
                </Link>
                <div className="rounded-[1.75rem] bg-white p-5 text-slate-900 shadow-sm">
                  <GraduationCap className="h-8 w-8 text-[var(--brand-coral)]" />
                  <h2 className="mt-4 text-xl font-black">Primeiro emprego</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Um lugar pensado para quem esta procurando a primeira oportunidade.</p>
                </div>
                <div className="rounded-[1.75rem] bg-white p-5 text-slate-900 shadow-sm">
                  <TrendingUp className="h-8 w-8 text-[var(--brand-cobalt)]" />
                  <h2 className="mt-4 text-xl font-black">Busca local forte</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Busque por cidade e estado de um jeito simples e rapido.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {orderedBlocks.map((blockKey) => (sectionsEnabled[blockKey] ? <div key={blockKey}>{pageSections[blockKey]}</div> : null))}
    </div>
  );
}
