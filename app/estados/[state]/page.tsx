import { HubType } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld";
import { getRecentPosts } from "@/lib/repositories/blog";
import { getStateBySlug } from "@/lib/repositories/geo";
import { getHubProfile } from "@/lib/repositories/hubs";
import { getCompanyHubs } from "@/lib/repositories/jobs";
import { renderFaqTemplate, renderTemplate } from "@/lib/site-copy";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const result = await getStateBySlug(state);
  const profile = await getHubProfile(HubType.STATE, state);

  if (!result) {
    return buildSiteMetadata({
      title: "Estado nao encontrado",
      description: "A pagina de estado nao foi encontrada.",
      pathname: `/estados/${state}`,
      noIndex: true
    });
  }

  return buildSiteMetadata({
    title: profile?.seoTitle || result.seoTitle || `Cidades com vagas de Jovem Aprendiz em ${result.name}`,
    description: profile?.seoDescription || result.seoIntro || `Explore cidades com vagas de Jovem Aprendiz em ${result.name}.`,
    pathname: `/estados/${result.slug}`,
    noIndex: profile?.noIndex || false,
    canonicalUrl: profile?.canonicalUrl || undefined,
    socialImageUrl: profile?.socialImageUrl || undefined
  });
}

export default async function StateDetailPage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const [result, posts, companies, profile, siteContent] = await Promise.all([
    getStateBySlug(state),
    getRecentPosts(),
    getCompanyHubs(),
    getHubProfile(HubType.STATE, state),
    getSiteContent()
  ]);

  if (!result) {
    notFound();
  }

  const templateValues = {
    stateName: result.name,
    stateCode: result.code,
    totalJobs: result._count.jobs
  };
  const faq = renderFaqTemplate(siteContent.hubContent.state.faq, templateValues);
  const faqTitle = renderTemplate(siteContent.hubContent.state.faqTitle, templateValues);
  const faqDescription = renderTemplate(siteContent.hubContent.state.faqDescription, templateValues);

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Estados", path: "/estados" }, { name: result.name, path: `/estados/${result.slug}` }])} />
      <JsonLd data={buildFaqJsonLd(faq)} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Estados", href: "/estados" }, { label: result.name }]} />

      <div className="brand-panel rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(26,43,76,0.22)] sm:px-8">
        <SectionHeading
          eyebrow={result.code}
          title={profile?.title || `Cidades com vagas de Jovem Aprendiz em ${result.name}`}
          description={profile?.intro || result.seoIntro || renderTemplate(siteContent.hubContent.state.introTemplate, templateValues)}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.cities.map((city) => (
              <Link
                key={city.id}
                href={`/vagas/estado/${result.slug}/${city.slug}`}
                className="brand-chip rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-slate-950">{city.name}</h2>
                <p className="mt-2 text-sm text-slate-600">{city._count.jobs} vaga(s) disponivel(is)</p>
              </Link>
            ))}
          </div>

          <div className="brand-soft-panel rounded-[2rem] border border-slate-200 p-8 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.32)]">
            <h2 className="text-2xl font-black text-slate-950">Como usar este hub do estado</h2>
            <p className="mt-3 text-base leading-8 text-slate-600">
              Entre pela cidade que faz sentido para a sua rotina, acompanhe as vagas mais recentes e use o blog para se preparar antes de se candidatar.
            </p>
          </div>

          {profile?.contentHtml ? (
            <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(profile.contentHtml) }} />
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="brand-chip rounded-[1.75rem] p-6">
            <h2 className="text-lg font-black text-slate-950">Empresas com vagas no estado</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {companies.filter((company) => company.stateSlug === result.slug).slice(0, 6).map((company) => (
                <Link key={company.slug} href={`/empresas/${company.slug}`} className="rounded-full border border-[color:rgba(26,43,76,0.1)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-text-secondary)] transition hover:border-[color:rgba(255,109,0,0.22)] hover:text-[var(--brand-orange)]">
                  {company.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-950">Conteudos relacionados</h2>
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
