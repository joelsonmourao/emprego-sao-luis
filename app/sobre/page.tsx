import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildSiteMetadata({
    title: siteContent.pages.about.seoTitle,
    description: siteContent.pages.about.seoDescription,
    pathname: "/sobre"
  });
}

export default async function AboutPage() {
  const siteContent = await getSiteContent();

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(34,73,245,0.45)] sm:px-8">
        <SectionHeading
          eyebrow="Sobre"
          title={siteContent.pages.about.title}
          description={siteContent.pages.about.description}
        />
      </div>
      <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.about.contentHtml) }} />
    </section>
  );
}
