type EditorialSchemaInput = {
  type: "Article" | "NewsArticle";
  title: string;
  description: string;
  canonical: string;
  authorName: string;
  publishedAt: Date | null;
  updatedAt: Date;
  image?: unknown;
  citations?: readonly string[];
  siteUrl: string;
};

const NEWSROOM_NAME = "Redação Empregos São Luís";

function normalizeExternalHttpsCitation(value: string, siteUrl: string): string | null {
  try {
    const site = new URL(siteUrl);
    const citation = new URL(value.replaceAll("&amp;", "&"));
    if (citation.protocol !== "https:" || citation.hostname === site.hostname) return null;
    citation.hash = "";
    return citation.toString();
  } catch {
    return null;
  }
}

export function extractExternalEditorialCitations(\n  contentHtml: string,\n  siteUrl: string,\n  additionalCitations: readonly string[] = []\n): string[] {
  const citations = new Set<string>();
  const linkPattern = /<a\b[^>]*\bhref\s*=\s*(["'])(https:\/\/[^"'<>]+)\1/gi;

  for (const match of contentHtml.matchAll(linkPattern)) {
    const citation = normalizeExternalHttpsCitation(match[2] ?? "", siteUrl);
    if (citation) citations.add(citation);
  }

  return [...citations];
}

export function buildNewsroomOrganization(siteUrl: string): Record<string, unknown> {
  const root = siteUrl.replace(/\/$/, "");
  return {
    "@type": "Organization",
    "@id": `${root}/redacao#organization`,
    name: NEWSROOM_NAME,
    url: `${root}/redacao`
  };
}

export function isNewsroomAuthor(authorName: string): boolean {
  const normalizedName = authorName.trim() || NEWSROOM_NAME;
  return /\bredação\b/i.test(normalizedName.normalize("NFC"));
}

export function buildEditorialSchema(input: EditorialSchemaInput): Record<string, unknown> {
  const root = input.siteUrl.replace(/\/$/, "");
  const authorName = input.authorName.trim() || NEWSROOM_NAME;
  const newsroom = isNewsroomAuthor(authorName);
  const modifiedAt = input.publishedAt && input.updatedAt < input.publishedAt
    ? input.publishedAt
    : input.updatedAt;
  const citations = [...new Set((input.citations ?? []).flatMap((value) => {
    const citation = normalizeExternalHttpsCitation(value, root);
    return citation ? [citation] : [];
  }))];

  return {
    "@type": input.type,
    headline: input.title.trim(),
    description: input.description.trim(),
    ...(input.publishedAt ? { datePublished: input.publishedAt.toISOString() } : {}),
    dateModified: modifiedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.canonical },
    author: newsroom
      ? { ...buildNewsroomOrganization(root), name: authorName }
      : { "@type": "Person", name: authorName },
    publisher: { "@id": `${root}#organization` },
    isAccessibleForFree: true,
    ...(citations.length ? { citation: citations } : {}),
    ...(input.image ? { image: input.image } : {})
  };
}
