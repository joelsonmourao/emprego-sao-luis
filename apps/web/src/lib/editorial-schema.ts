type EditorialSchemaInput = {
  type: "Article" | "NewsArticle";
  title: string;
  description: string;
  canonical: string;
  authorName: string;
  publishedAt: Date | null;
  updatedAt: Date;
  image?: unknown;
  siteUrl: string;
};

const NEWSROOM_NAME = "Redação Empregos São Luís";

export function buildEditorialSchema(input: EditorialSchemaInput): Record<string, unknown> {
  const root = input.siteUrl.replace(/\/$/, "");
  const authorName = input.authorName.trim() || NEWSROOM_NAME;
  const newsroom = /\bredação\b/i.test(authorName.normalize("NFC"));
  const modifiedAt = input.publishedAt && input.updatedAt < input.publishedAt
    ? input.publishedAt
    : input.updatedAt;

  return {
    "@type": input.type,
    headline: input.title.trim(),
    description: input.description.trim(),
    ...(input.publishedAt ? { datePublished: input.publishedAt.toISOString() } : {}),
    dateModified: modifiedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": input.canonical },
    author: newsroom
      ? { "@type": "Organization", name: authorName, url: `${root}/redacao` }
      : { "@type": "Person", name: authorName },
    publisher: { "@id": `${root}#organization` },
    isAccessibleForFree: true,
    ...(input.image ? { image: input.image } : {})
  };
}
