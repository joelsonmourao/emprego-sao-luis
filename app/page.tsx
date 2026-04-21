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
import { getCityJobsPath, getCompanyJobsPath } from "@/lib/seo/jobs-pages";
import { buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getPostsBySlugs, getRecentPosts } from "@/lib/repositories/blog";
import { getFeaturedCompanies, getFeaturedCompaniesBySlugs, getFeaturedJobs, getJobsBySlugs } from "@/lib/repositories/jobs";
import { getCities, getCitiesBySlugs, getSearchGeoData, getStates, getStatesBySlugs } from "@/lib/repositories/geo";
import { getSiteContent } from "@/lib/site-content";
import { homeBlockKeys } from "@/lib/schemas/site-admin";
import { getSiteSettings } from "@/lib/site-settings";

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
    siteContent,
    settings
  ] = await Promise.all([
    getFeaturedJobs(),
    getRecentPosts(),
    getStates(),
    getCities(),
    getSearchGeoData(),
    getFeaturedCompanies(),
    getSiteContent(),
    getSiteSettings()
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
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-4 lg:grid-cols-2 sm:gap-6">
          <Link href="/vagas" className="brand-chip rounded-[1.5rem] p-5 transition hover:-translate-y-1 hover:shadow-[0_28px_80px_-52px_rgba(26,43,76,0.4)] sm:rounded-[2rem] sm:p-7">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-orange)] sm:text-xs sm:tracking-[0.28em]">
                  {siteContent.home.quickJobsEyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black text-[var(--brand-navy)] leading-tight sm:mt-3 sm:text-3xl">{siteContent.home.quickJobsTitle}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--brand-text-secondary)] sm:mt-3 sm:text-base sm:leading-7">{siteContent.home.quickJobsDescription}</p>
              </div>
              <BriefcaseBusiness className="h-8 w-8 text-[var(--brand-orange)] sm:h-10 sm:w-10" />
            </div>
          </Link>

          <Link
            href="/blog"
            className="rounded-[1.5rem] border border-[color:rgba(255,109,0,0.18)] bg-[linear-gradient(145deg,#1a2b4c_0%,#21406e_56%,#2f6fed_100%)] p-5 text-white shadow-[0_30px_90px_-55px_rgba(26,43,76,0.68)] transition hover:-translate-y-1 sm:rounded-[2rem] sm:p-7"
          >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-100 sm:text-xs sm:tracking-[0.28em]">
                  {siteContent.home.quickBlogEyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-black leading-tight sm:mt-3 sm:text-3xl">{siteContent.home.quickBlogTitle}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/86 sm:mt-3 sm:text-base sm:leading-7">{siteContent.home.quickBlogDescription}</p>
              </div>
              <Newspaper className="h-8 w-8 text-[var(--brand-orange)] sm:h-10 sm:w-10" />
            </div>
          </Link>
        </div>
        
        {settings.google.adsenseEnabled && settings.google.adsensePublisherId ? (
          <div className="mt-4 sm:mt-6">
            <AdSlot
              publisherId={settings.google.adsensePublisherId}
              slot="1234567890"
              format="auto"
              fullWidthResponsive={true}
            />
          </div>
        ) : null}
      </section>
    ),
    featuredJobs: (
      <section className="mx-auto max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-10">
        <div className="space-y-6">
          <SectionHeading eyebrow="Vagas em destaque" title={siteContent.home.featuredTitle} description={siteContent.home.featuredDescription} />
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {settings.google.adsenseEnabled && settings.google.adsensePublisherId ? (
            <div className="my-4 sm:my-6">
              <AdSlot
                publisherId={settings.google.adsensePublisherId}
                slot="2345678901"
                format="auto"
                fullWidthResponsive={true}
              />
            </div>
          ) : null}
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/vagas">
                Ver todas as vagas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-4 sm:space-y-6">
          <div className="brand-chip rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
            <h2 className="text-base font-black text-[var(--brand-navy)] sm:text-lg">Estados em destaque</h2>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
              {states.slice(0, 8).map((state) => (
                <Link
                  key={state.id}
                  href={`/vagas/estado/${state.slug}`}
                  className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.26)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
                >
                  {state.name} ({state._count.jobs})
                </Link>
              ))}
            </div>
          </div>
          <div className="brand-panel rounded-[1.5rem] border border-slate-200 p-4 shadow-[0_25px_80px_-50px_rgba(26,43,76,0.2)] sm:rounded-[2rem] sm:p-6">
            <h2 className="text-base font-black text-[var(--brand-navy)] sm:text-lg">Cidades que estao puxando novas vagas</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:leading-7">
              Explore cidades com movimentacao recente para encontrar oportunidades mais perto da sua rotina.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
              {cities.slice(0, 6).map((city) => (
                <Link
                  key={city.id}
                  href={getCityJobsPath(city.slug)}
                  className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.26)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
                >
                  {city.name}, {city.state.code}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    ),
    blog: (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
        <SectionHeading eyebrow="Blog" title={siteContent.home.blogTitle} description={siteContent.home.blogDescription} />
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {recentPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        {settings.google.adsenseEnabled && settings.google.adsensePublisherId ? (
          <div className="my-4 sm:my-6">
            <AdSlot
              publisherId={settings.google.adsensePublisherId}
              slot="3456789012"
              format="auto"
              fullWidthResponsive={true}
            />
          </div>
        ) : null}
        
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button asChild size="lg" variant="outline" className="rounded-2xl">
            <Link href="/blog">Acessar blog</Link>
          </Button>
        </div>
      </section>
    ),
    howItWorks: (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {siteContent.home.howItWorksSteps.map((step) => {
            const Icon = iconMap[step.iconKey as keyof typeof iconMap] ?? Building2;

            return (
              <div key={step.title} className="brand-chip rounded-[1.5rem] p-4 sm:rounded-[1.75rem] sm:p-6">
                <Icon className="h-6 w-6 text-[var(--brand-orange)] sm:h-7 sm:w-7" />
                <h2 className="mt-3 text-xl font-black text-[var(--brand-navy)] leading-tight sm:mt-4 sm:text-2xl">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:leading-7">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
    citiesAndBenefits: (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <div className="brand-panel rounded-[1.5rem] border border-slate-200 p-5 shadow-[0_25px_90px_-54px_rgba(26,43,76,0.24)] sm:rounded-[2rem] sm:p-8">
            <SectionHeading
              eyebrow="Cidades em destaque"
              title={siteContent.home.citiesTitle}
              description={siteContent.home.citiesDescription}
            />
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
              {cities.slice(0, 8).map((city) => (
                <Link
                  key={city.id}
                  href={getCityJobsPath(city.slug)}
                  className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.28)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-2 sm:text-sm"
                >
                  {city.name}, {city.state.code}
                </Link>
              ))}
            </div>
          </div>

          <div className="brand-dark-panel rounded-[1.5rem] p-5 text-white shadow-[0_30px_100px_-50px_rgba(26,43,76,0.8)] sm:rounded-[2rem] sm:p-8">
            <SectionHeading
              eyebrow="Beneficios do programa"
              title={siteContent.home.benefitsTitle}
              description={siteContent.home.benefitsDescription}
              tone="light"
            />
            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5">
              {siteContent.home.benefits.slice(0, 3).map((item) => {
                const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? GraduationCap;

                return (
                  <div key={item.title} className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.4)] backdrop-blur sm:p-5">
                    <Icon className="h-6 w-6 text-[var(--brand-orange)] sm:h-7 sm:w-7" />
                    <h3 className="mt-3 text-lg font-black text-white leading-tight sm:mt-4 sm:text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/88 sm:leading-7">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    ),
    careerCtas: (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {siteContent.home.careerCtas.map((item) => {
            const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? ArrowRight;

            return (
              <Link key={item.title} href={item.href as Route} className="brand-chip rounded-[1.5rem] p-4 transition hover:-translate-y-1 sm:rounded-[2rem] sm:p-6">
                <Icon className="h-7 w-7 text-[var(--brand-orange)] sm:h-8 sm:w-8" />
                <h3 className="mt-4 text-xl font-black text-[var(--brand-navy)] leading-tight sm:mt-5 sm:text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:leading-7">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    ),
    companies: (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="brand-chip rounded-[1.5rem] p-4 sm:rounded-[2rem] sm:p-6">
            <h2 className="text-base font-black text-[var(--brand-navy)] sm:text-lg">{siteContent.home.companiesTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-text-secondary)] sm:leading-7">{siteContent.home.companiesDescription}</p>
            <div className="mt-4 grid gap-3 sm:mt-5">
              {companies.slice(0, 6).map((company) => (
                <Link
                  key={company.slug}
                    href={getCompanyJobsPath(company.slug)}
                  className="rounded-[1.25rem] border border-[color:rgba(26,43,76,0.1)] bg-white px-3 py-3 text-sm text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.24)] hover:text-[var(--brand-orange)] sm:px-4 sm:py-4"
                >
                  <span className="block font-semibold text-[var(--brand-navy)]">{company.name}</span>
                  <span className="mt-1 block text-[var(--brand-text-secondary)]">
                    {company.city.name}, {company.state.code}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-[var(--brand-orange)]">
                    {company._count.jobs} vaga(s) publicada(s)
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="brand-dark-panel rounded-[1.5rem] p-5 text-white shadow-[0_30px_100px_-50px_rgba(26,43,76,0.78)] sm:rounded-[2rem] sm:p-7">
            <h2 className="text-lg font-black leading-tight sm:text-xl">Oportunidades por cidade ajudam a filtrar mais rapido</h2>
            <p className="mt-2 text-sm leading-6 text-white/84 sm:mt-3 sm:leading-7">
              Quando voce entra por cidade ou empresa, a navegacao fica menos genérica e o portal mostra oportunidades mais perto do seu contexto.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
              {cities.slice(0, 5).map((city) => (
                <Link
                  key={city.id}
                  href={getCityJobsPath(city.slug)}
                  className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/16 sm:px-4 sm:py-2 sm:text-sm"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
    faq: (
      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 sm:space-y-8 lg:px-8 lg:py-10">
        <SectionHeading eyebrow="FAQ" title={siteContent.home.faqTitle} description={siteContent.home.faqDescription} />
        <FaqList />
        
        {settings.google.adsenseEnabled && settings.google.adsensePublisherId ? (
          <div className="mt-4 sm:mt-6">
            <AdSlot
              publisherId={settings.google.adsensePublisherId}
              slot="4567890123"
              format="auto"
              fullWidthResponsive={true}
            />
          </div>
        ) : null}
      </section>
    ),
    finalCta: (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,#1a2b4c_0%,#21406e_44%,#2f6fed_100%)] p-5 text-white sm:rounded-[2rem] sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center sm:gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-100 sm:text-xs sm:tracking-[0.28em]">{siteContent.home.finalCtaEyebrow}</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight leading-tight sm:mt-4 sm:text-4xl">{siteContent.home.finalCtaTitle}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/86 sm:mt-4 sm:text-base sm:leading-8">{siteContent.home.finalCtaDescription}</p>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <Button asChild size="lg" className="bg-[var(--brand-orange)] text-white hover:bg-[#e56200]">
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
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#1a2b4c_0%,#21406e_34%,#2f6fed_76%,#ff6d00_100%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.16),transparent_16%),radial-gradient(circle_at_88%_14%,rgba(255,179,71,0.16),transparent_14%),radial-gradient(circle_at_72%_80%,rgba(255,255,255,0.12),transparent_18%)]" />
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-12 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-16">
          <div className="relative space-y-5">
            <div className="inline-flex rounded-full border border-white/18 bg-white/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-50 sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.28em]">
              {siteContent.home.heroBadge}
            </div>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-[1.75rem] font-black tracking-tight leading-[1.1] sm:text-4xl sm:leading-[1.08] xl:text-6xl">{siteContent.home.heroTitle}</h1>
              <p className="max-w-3xl text-[14px] leading-6 text-white/86 sm:text-base sm:leading-7">{siteContent.home.heroDescription}</p>
            </div>

            <JobSearchForm
              states={searchStates}
              action="/vagas"
              submitLabel="Ver vagas"
              helperText={siteContent.home.searchHelperText}
              footerLinkHref="/vagas"
              footerLinkLabel="Abrir todas as vagas"
            />

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-4">
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

          <div className="relative hidden lg:block">
            <div className="mesh-surface rounded-[2rem] border border-white/20 p-4 shadow-[0_40px_120px_-50px_rgba(26,43,76,0.72)] sm:rounded-[2.5rem] sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {siteContent.home.heroHighlights.slice(0, 4).map((item, index) => {
                  const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? BriefcaseBusiness;
                  const featured = index === 1;

                  return (
                    <Link
                      key={`${item.title}-${item.href}`}
                      href={item.href as Route}
                      className={
                        featured
                          ? "rounded-[1.5rem] bg-[linear-gradient(145deg,#1a2b4c_0%,#21406e_54%,#2f6fed_100%)] p-4 text-white shadow-[0_20px_50px_-30px_rgba(26,43,76,0.72)] transition hover:-translate-y-1 sm:rounded-[1.75rem] sm:p-5"
                          : "rounded-[1.5rem] bg-white p-4 text-[var(--brand-navy)] shadow-sm transition hover:-translate-y-1 sm:rounded-[1.75rem] sm:p-5"
                      }
                    >
                      <Icon className={`h-8 w-8 ${featured ? "text-[var(--brand-orange)]" : "text-[var(--brand-blue)]"}`} />
                      <h2 className="mt-3 text-lg font-black leading-tight sm:mt-4 sm:text-xl">{item.title}</h2>
                      <p className={`mt-2 text-sm leading-6 ${featured ? "text-white/84" : "text-[var(--brand-text-secondary)]"}`}>{item.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {orderedBlocks.map((blockKey) => (sectionsEnabled[blockKey] ? <div key={blockKey}>{pageSections[blockKey]}</div> : null))}
    </div>
  );
}
