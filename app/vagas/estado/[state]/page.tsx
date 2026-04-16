import { HubType } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JobCard } from "@/components/job-card";
import { JsonLd } from "@/components/json-ld";
import { PaginationNav } from "@/components/pagination-nav";
import { SectionHeading } from "@/components/section-heading";
import { buildCollectionPageJsonLd, buildStateJobsSeo } from "@/lib/hub-seo";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getRecentPosts } from "@/lib/repositories/blog";
import { getStateBySlug } from "@/lib/repositories/geo";
import { getHubProfile } from "@/lib/repositories/hubs";
import { getCompanyHubs, getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";
import { renderFaqTemplate, renderTemplate } from "@/lib/site-copy";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ state: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { state } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });
  const result = await getStateBySlug(state);
  const profile = await getHubProfile(HubType.STATE, state);

  if (!result) {
    return buildSiteMetadata({
      title: "Estado nao encontrado",
      description: "A listagem estadual nao foi encontrada.",
      pathname: `/vagas/estado/${state}`,
      noIndex: true
    });
  }

  const jobs = await getJobsList({ stateSlug: state, order: parsed.order, page: parsed.page });
  const seo = buildStateJobsSeo({
    stateName: result.name,
    stateCode: result.code,
    totalJobs: jobs.total,
    pathname: `/vagas/estado/${result.slug}`,
    seoTitle: profile?.seoTitle,
    seoDescription: profile?.seoDescription,
    canonicalUrl: profile?.canonicalUrl
  });

  return buildSiteMetadata({
    title: seo.title,
    description: seo.description,
    pathname: `/vagas/estado/${result.slug}`,
    noIndex: profile?.noIndex || parsed.page > 1,
    canonicalUrl: seo.canonicalUrl || undefined,
    socialImageUrl: profile?.socialImageUrl || undefined
  });
}

export default async function JobsByStatePage({
  params,
  searchParams
}: {
  params: Promise<{ state: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { state } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });
  const [stateData, jobs, posts, companies, profile, siteContent] = await Promise.all([
    getStateBySlug(state),
    getJobsList({ stateSlug: state, order: parsed.order, page: parsed.page }),
    getRecentPosts(),
    getCompanyHubs(),
    getHubProfile(HubType.STATE, state),
    getSiteContent()
  ]);

  if (!stateData) {
    notFound();
  }

  const templateValues = {
    stateName: stateData.name,
    stateCode: stateData.code,
    totalJobs: jobs.total
  };
  const faq = renderFaqTemplate(siteContent.hubContent.state.faq, templateValues);
  const faqTitle = renderTemplate(siteContent.hubContent.state.faqTitle, templateValues);
  const faqDescription = renderTemplate(siteContent.hubContent.state.faqDescription, templateValues);
  const seo = buildStateJobsSeo({
    stateName: stateData.name,
    stateCode: stateData.code,
    totalJobs: jobs.total,
    pathname: `/vagas/estado/${stateData.slug}`,
    seoTitle: profile?.seoTitle,
    seoDescription: profile?.seoDescription,
    canonicalUrl: profile?.canonicalUrl
  });
  const intro = profile?.intro || seo.intro || renderTemplate(siteContent.hubContent.state.introTemplate, templateValues);

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (parsed.order) params.set("order", parsed.order);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `/vagas/estado/${stateData.slug}?${query}` : `/vagas/estado/${stateData.slug}`;
  };

  const buildOrderHref = (order: "relevance" | "date") => `/vagas/estado/${stateData.slug}?order=${order}`;

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Vagas", path: "/vagas" }, { name: stateData.name, path: `/vagas/estado/${stateData.slug}` }])} />
      <JsonLd data={buildFaqJsonLd(faq)} />
      <JsonLd data={buildCollectionPageJsonLd({ name: seo.h1, description: seo.description, path: `/vagas/estado/${stateData.slug}` })} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vagas", href: "/vagas" }, { label: stateData.name }]} />

      <div className="brand-panel rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Vagas por estado</p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] sm:text-5xl">{seo.h1}</h1>
          <p className="max-w-4xl text-base leading-8 text-[var(--brand-text-secondary)] sm:text-lg">{intro}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-[var(--brand-text-secondary)]">Ordenar por:</span>
            <Link href={buildOrderHref("relevance") as never} className={parsed.order === "relevance" ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"}>
              Relevancia
            </Link>
            <Link href={buildOrderHref("date") as never} className={parsed.order === "date" ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"}>
              Data
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <PaginationNav page={jobs.page} totalPages={jobs.totalPages} buildHref={buildPageHref} />

          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_80px_-60px_rgba(26,43,76,0.18)]">
            <h2 className="text-2xl font-black text-[var(--brand-navy)]">Navegue por cidades do estado</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {stateData.cities.slice(0, 8).map((city) => (
                <Link key={city.id} href={`/vagas/estado/${stateData.slug}/${city.slug}`} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          {profile?.contentHtml ? (
            <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(profile.contentHtml) }} />
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.75rem] p-6">
            <h2 className="text-lg font-black text-[var(--brand-navy)]">Empresas com vagas no estado</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {companies.filter((company) => company.stateSlug === stateData.slug).slice(0, 6).map((company) => (
                <Link key={company.slug} href={`/empresas/${company.slug}`} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
                  {company.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Dicas relacionadas</h2>
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </aside>
      </div>

      <div className="space-y-6">
        <SectionHeading eyebrow="Perguntas frequentes" title={faqTitle} description={faqDescription} />
        <FaqList items={faq} />
      </div>
    </section>
  );
}
