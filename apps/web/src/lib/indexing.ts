export function publicJobUrl(slug: string, siteUrl = process.env.SITE_URL ?? "https://empregossaoluis.com.br") {
  return new URL(`/vagas/${slug}`, siteUrl).toString();
}

export function publicArticleUrl(slug: string, type: "NEWS" | "GUIDE" | "DATA_REPORT", siteUrl = process.env.SITE_URL ?? "https://empregossaoluis.com.br") {
  const prefix = type === "NEWS" ? "/noticias" : "/blog";
  return new URL(`${prefix}/${slug}`, siteUrl).toString();
}

export function indexingDedupeKey(prefix: string, id: string, provider: string, version?: number | string) {
  return `${prefix}:${id}${version !== undefined ? `:${version}` : ""}:${provider}`;
}

export type IndexingNotification = { dedupeKey: string; jobId?: string; provider: "GOOGLE" | "INDEXNOW"; url: string; notificationType: "URL_UPDATED" | "URL_DELETED" };

export function buildPublishIndexingEvents(input: { id: string; slug: string; version?: number; prefix?: string }) {
  const url = publicJobUrl(input.slug);
  const prefix = input.prefix ?? "publish";
  const version = input.version ?? Date.now();
  return [
    { dedupeKey: indexingDedupeKey(prefix, input.id, "google", version), jobId: input.id, provider: "GOOGLE" as const, url, notificationType: "URL_UPDATED" as const },
    { dedupeKey: indexingDedupeKey(prefix, input.id, "indexnow", version), jobId: input.id, provider: "INDEXNOW" as const, url, notificationType: "URL_UPDATED" as const }
  ];
}

export function buildRemoveIndexingEvents(input: { id: string; slug: string; prefix?: string }) {
  const url = publicJobUrl(input.slug);
  const prefix = input.prefix ?? "remove";
  return [
    { dedupeKey: indexingDedupeKey(prefix, input.id, "google"), jobId: input.id, provider: "GOOGLE" as const, url, notificationType: "URL_DELETED" as const },
    { dedupeKey: indexingDedupeKey(prefix, input.id, "indexnow"), jobId: input.id, provider: "INDEXNOW" as const, url, notificationType: "URL_UPDATED" as const }
  ];
}

export function buildArticleIndexingEvent(input: { id: string; slug: string; type: "NEWS" | "GUIDE" | "DATA_REPORT"; prefix?: string }) {
  const url = publicArticleUrl(input.slug, input.type);
  const prefix = input.prefix ?? "article";
  return { dedupeKey: indexingDedupeKey(prefix, input.id, "indexnow"), provider: "INDEXNOW" as const, url, notificationType: "URL_UPDATED" as const };
}

export function isGoogleIndexingEnabled() {
  return process.env.GOOGLE_INDEXING_ENABLED !== "false";
}

export function indexingIntegrationStatus() {
  return {
    google: {
      configured: Boolean(process.env.GOOGLE_INDEXING_CLIENT_EMAIL && process.env.GOOGLE_INDEXING_PRIVATE_KEY),
      enabled: isGoogleIndexingEnabled()
    },
    indexNow: {
      configured: Boolean(process.env.INDEXNOW_KEY && process.env.SITE_URL)
    },
    meta: {
      configured: Boolean(process.env.META_INSTAGRAM_ACCOUNT_ID && process.env.META_PAGE_ACCESS_TOKEN)
    }
  };
}
