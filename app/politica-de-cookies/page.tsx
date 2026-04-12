import { SectionHeading } from "@/components/section-heading";
import { sanitizeRichTextHtml } from "@/lib/rich-text";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata() {
  const siteContent = await getSiteContent();
  return buildSiteMetadata({
    title: siteContent.pages.cookies.seoTitle,
    description: siteContent.pages.cookies.seoDescription,
    pathname: "/politica-de-cookies"
  });
}

export default async function CookiesPolicyPage() {
  const siteContent = await getSiteContent();

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-4 py-14 sm:px-6 lg:px-8">
      <div className="brand-page-hero rounded-[2.2rem] border border-slate-200 px-6 py-8 shadow-[0_35px_120px_-70px_rgba(34,73,245,0.45)] sm:px-8">
        <SectionHeading eyebrow="Cookies" title={siteContent.pages.cookies.title} description={siteContent.pages.cookies.description} />
      </div>
      <div className="prose-content rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-700 shadow-sm" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(siteContent.pages.cookies.contentHtml) }} />
    </section>
  );
}

