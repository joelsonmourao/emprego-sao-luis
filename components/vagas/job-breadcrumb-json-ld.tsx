import { buildBreadcrumbJsonLd, stringifyJsonLdSafe } from "@/lib/seo/json-ld";

type Item = { name: string; path: string };

/** Server Component: BreadcrumbList para página de vaga (não duplica localização da vaga). */
export function JobBreadcrumbJsonLd({ items }: { items: Item[] }) {
  const json = stringifyJsonLdSafe(buildBreadcrumbJsonLd(items));
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
