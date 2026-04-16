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
import { buildCollectionPageJsonLd, buildCompanyJobsSeo } from "@/lib/hub-seo";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getRelatedPosts } from "@/lib/repositories/blog";
import { getHubProfile } from "@/lib/repositories/hubs";
import { getCompanyHubBySlug, getCompanyHubs, getJobsList } from "@/lib/repositories/jobs";
import { jobSearchParamsSchema } from "@/lib/schemas/search";
import { renderFaqTemplate, renderTemplate } from "@/lib/site-copy";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });
  const company = await getCompanyHubBySlug(slug);
  const profile = await getHubProfile(HubType.COMPANY, slug);

  if (!company) {
    return buildSiteMetadata({
      title: "Empresa nao encontrada",
      description: "A pagina de empresa solicitada nao foi encontrada.",
      pathname: `/empresas/${slug}`,
      noIndex: true
    });
  }

  const jobs = await getJobsList({ page: parsed.page, companySlug: company.slug, order: parsed.order });
  const seo = buildCompanyJobsSeo({
    companyName: company.name,
    cityName: company.city.name,
    stateCode: company.state.code,
    totalJobs: jobs.total,
    pathname: `/empresas/${company.slug}`,
    seoTitle: profile?.seoTitle,
    seoDescription: profile?.seoDescription,
    canonicalUrl: profile?.canonicalUrl
  });

  return buildSiteMetadata({
    title: seo.title,
    description: seo.description,
    pathname: `/empresas/${company.slug}`,
    noIndex: profile?.noIndex || parsed.page > 1,
    canonicalUrl: seo.canonicalUrl || undefined,
    socialImageUrl: profile?.socialImageUrl || undefined
  });
}

export default async function CompanyDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const raw = await searchParams;
  const parsed = jobSearchParamsSchema.parse({
    order: typeof raw.order === "string" ? raw.order : undefined,
    page: typeof raw.page === "string" ? raw.page : undefined
  });
  const company = await getCompanyHubBySlug(slug);

  if (!company) {
    notFound();
  }

  const [allCompanies, posts, companyJobs, profile, siteContent] = await Promise.all([
    getCompanyHubs(),
    getRelatedPosts({ limit: 3 }),
    getJobsList({ page: parsed.page, companySlug: company.slug, order: parsed.order }),
    getHubProfile(HubType.COMPANY, company.slug),
    getSiteContent()
  ]);

  const templateValues = {
    companyName: company.name,
    totalJobs: companyJobs.total,
    cityName: company.city.name,
    stateCode: company.state.code
  };
  const faq = renderFaqTemplate(siteContent.hubContent.company.faq, templateValues);
  const faqTitle = renderTemplate(siteContent.hubContent.company.faqTitle, templateValues);
  const faqDescription = renderTemplate(siteContent.hubContent.company.faqDescription, templateValues);
  const relatedCompanies = allCompanies.filter((item) => item.slug !== company.slug).slice(0, 6);
  const seo = buildCompanyJobsSeo({
    companyName: company.name,
    cityName: company.city.name,
    stateCode: company.state.code,
    totalJobs: companyJobs.total,
    pathname: `/empresas/${company.slug}`,
    seoTitle: profile?.seoTitle,
    seoDescription: profile?.seoDescription,
    canonicalUrl: profile?.canonicalUrl
  });
  const intro = profile?.intro || renderTemplate(siteContent.hubContent.company.introTemplate, templateValues) || seo.intro;

  const buildPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (parsed.order) params.set("order", parsed.order);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    const query = params.toString();
    return query ? `/empresas/${company.slug}?${query}` : `/empresas/${company.slug}`;
  };

  const buildOrderHref = (order: "relevance" | "date") => `/empresas/${company.slug}?order=${order}`;

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Empresas", path: "/empresas" }, { name: company.name, path: `/empresas/${company.slug}` }])} />
      <JsonLd data={buildFaqJsonLd(faq)} />
      <JsonLd data={buildCollectionPageJsonLd({ name: seo.h1, description: seo.description, path: `/empresas/${company.slug}` })} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Empresas", href: "/empresas" }, { label: company.name }]} />

      <div className="brand-panel rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <div className="space-y-4">
          {company.logoUrl ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <img src={company.logoUrl} alt={company.name} className="h-10 w-10 rounded-2xl border border-slate-200 bg-white object-cover p-1" />
              {company.name}
            </div>
          ) : null}
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Vagas por empresa</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{seo.h1}</h1>
          <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">{intro}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              {company.city.name}, {company.state.code}
            </span>
            {company.websiteUrl ? (
              <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-semibold text-[var(--brand-blue)] shadow-sm transition hover:text-[var(--brand-orange)]">
                Visitar site da empresa
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold text-slate-700">Ordenar por:</span>
            <Link href={buildOrderHref("relevance") as never} className={parsed.order === "relevance" ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"}>
              Relevancia
            </Link>
            <Link href={buildOrderHref("date") as never} className={parsed.order === "date" ? "rounded-full bg-[var(--brand-navy)] px-4 py-2 font-semibold text-white" : "rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]"}>
              Data
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {companyJobs.items.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <PaginationNav page={companyJobs.page} totalPages={companyJobs.totalPages} buildHref={buildPageHref} />

          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.32)]">
            <h2 className="text-2xl font-black text-slate-950">Mais caminhos para continuar a busca</h2>
            <p className="mt-3 text-base leading-8 text-slate-600">
              A {company.name} aparece com mais frequencia em {company.city.name}, {company.state.code}. Aproveite os links ao lado para comparar outras empresas e continuar a busca.
            </p>
          </div>

          {profile?.contentHtml ? (
            <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(profile.contentHtml) }} />
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.75rem] p-6">
            <h2 className="text-lg font-black text-slate-950">Empresas relacionadas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {relatedCompanies.map((item) => (
                <Link key={item.slug} href={`/empresas/${item.slug}`} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Dicas relacionadas</h2>
            {posts.map((post) => (
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
