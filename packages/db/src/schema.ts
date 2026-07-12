import { relations, sql } from "drizzle-orm";
import { boolean, index, integer, jsonb, numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
};

export const publicationStatus = pgEnum("es_publication_status", ["DRAFT", "PENDING_REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "PAUSED", "EXPIRED", "CLOSED", "REJECTED", "DUPLICATE", "ARCHIVED"]);
export const verificationStatus = pgEnum("es_verification_status", ["UNVERIFIED", "SOURCE_CONFIRMED", "COMPANY_VERIFIED", "LINK_CONFIRMED", "NEEDS_REVIEW", "FAILED"]);
export const originType = pgEnum("es_origin_type", ["MANUAL", "SPREADSHEET", "API", "COMPANY_SUBMISSION", "INTERNAL_IMPORT", "OFFICIAL_SOURCE", "PARTNER"]);
export const contentType = pgEnum("es_content_type", ["NEWS", "GUIDE", "DATA_REPORT"]);
export const queueStatus = pgEnum("es_queue_status", ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"]);

export const states = pgTable("es_states", {
  id: uuid("id").primaryKey().defaultRandom(), legacyId: text("legacy_id").unique(), code: varchar("code", { length: 2 }).notNull().unique(), name: text("name").notNull(), slug: text("slug").notNull().unique(), ...timestamps
});
export const cities = pgTable("es_cities", {
  id: uuid("id").primaryKey().defaultRandom(), stateId: uuid("state_id").notNull().references(() => states.id), name: text("name").notNull(), normalizedName: text("normalized_name"), slug: text("slug").notNull(), ibgeCode: text("ibge_code"), metropolitanRegion: boolean("metropolitan_region").notNull().default(false), active: boolean("active").notNull().default(true), featured: boolean("featured").notNull().default(false), seoTitle: text("seo_title"), metaDescription: text("meta_description"), canonicalUrl: text("canonical_url"), latitude: numeric("latitude"), longitude: numeric("longitude"), ...timestamps
}, (t) => [uniqueIndex("es_cities_state_slug_uq").on(t.stateId, t.slug)]);
export const neighborhoods = pgTable("es_neighborhoods", { id: uuid("id").primaryKey().defaultRandom(), cityId: uuid("city_id").notNull().references(() => cities.id), name: text("name").notNull(), normalizedName: text("normalized_name").notNull(), slug: text("slug").notNull(), active: boolean("active").notNull().default(true), ...timestamps }, (t) => [uniqueIndex("es_neighborhoods_city_slug_uq").on(t.cityId, t.slug)]);
export const companies = pgTable("es_companies", {
  id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull(), normalizedName: text("normalized_name"), legalName: text("legal_name"), slug: text("slug").notNull().unique(), cityId: uuid("city_id").references(() => cities.id), websiteUrl: text("website_url"), logoUrl: text("logo_url"), descriptionHtml: text("description_html"), instagramUrl: text("instagram_url"), linkedinUrl: text("linkedin_url"), phone: text("phone"), whatsapp: text("whatsapp"), contactEmail: text("contact_email"), verifiedAt: timestamp("verified_at", { withTimezone: true }), sponsored: boolean("sponsored").notNull().default(false), featured: boolean("featured").notNull().default(false), seoTitle: text("seo_title"), metaDescription: text("meta_description"), canonicalUrl: text("canonical_url"), active: boolean("active").notNull().default(true), ...timestamps
});
export const categories = pgTable("es_categories", {
  id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull(), slug: text("slug").notNull().unique(), description: text("description"), icon: text("icon"), sortOrder: integer("sort_order").notNull().default(0), active: boolean("active").notNull().default(true), featured: boolean("featured").notNull().default(false), seoTitle: text("seo_title"), metaDescription: text("meta_description"), canonicalUrl: text("canonical_url"), ...timestamps
});
export const users = pgTable("es_users", {
  id: uuid("id").primaryKey().defaultRandom(), email: text("email").notNull().unique(), name: text("name").notNull(), passwordHash: text("password_hash"), emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }), mfaEnabled: boolean("mfa_enabled").notNull().default(false), mfaSecretEncrypted: text("mfa_secret_encrypted"), mfaPendingSecretEncrypted: text("mfa_pending_secret_encrypted"), recoveryCodeHashes: jsonb("recovery_code_hashes").notNull().default([]), active: boolean("active").notNull().default(true), ...timestamps
});
export const roles = pgTable("es_roles", { id: uuid("id").primaryKey().defaultRandom(), key: text("key").notNull().unique(), name: text("name").notNull(), ...timestamps });
export const permissions = pgTable("es_permissions", { id: uuid("id").primaryKey().defaultRandom(), key: text("key").notNull().unique(), description: text("description"), ...timestamps });
export const userRoles = pgTable("es_user_roles", { userId: uuid("user_id").notNull().references(() => users.id), roleId: uuid("role_id").notNull().references(() => roles.id), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (t) => [uniqueIndex("es_user_roles_uq").on(t.userId, t.roleId)]);
export const rolePermissions = pgTable("es_role_permissions", { roleId: uuid("role_id").notNull().references(() => roles.id), permissionId: uuid("permission_id").notNull().references(() => permissions.id) }, (t) => [uniqueIndex("es_role_permissions_uq").on(t.roleId, t.permissionId)]);
export const sessions = pgTable("es_sessions", { id: uuid("id").primaryKey().defaultRandom(), userId: uuid("user_id").notNull().references(() => users.id), tokenHash: text("token_hash").notNull().unique(), ipHash: text("ip_hash"), userAgentHash: text("user_agent_hash"), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), revokedAt: timestamp("revoked_at", { withTimezone: true }), ...timestamps });
export const passwordResetTokens = pgTable("es_password_reset_tokens", { id: uuid("id").primaryKey().defaultRandom(), userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), tokenHash: text("token_hash").notNull().unique(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), usedAt: timestamp("used_at", { withTimezone: true }), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const candidateSessions = pgTable("es_candidate_sessions", { id: uuid("id").primaryKey().defaultRandom(), userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), tokenHash: text("token_hash").notNull().unique(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), revokedAt: timestamp("revoked_at", { withTimezone: true }), ...timestamps });
export const magicLinkTokens = pgTable("es_magic_link_tokens", { id: uuid("id").primaryKey().defaultRandom(), userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), tokenHash: text("token_hash").notNull().unique(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), usedAt: timestamp("used_at", { withTimezone: true }), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const userJobPreferences = pgTable("es_user_job_preferences", { userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }), cities: jsonb("cities").notNull().default([]), categories: jsonb("categories").notNull().default([]), workplaceTypes: jsonb("workplace_types").notNull().default([]), emailAlerts: boolean("email_alerts").notNull().default(false), ...timestamps });
export const loginAttempts = pgTable("es_login_attempts", { id: uuid("id").primaryKey().defaultRandom(), emailHash: text("email_hash").notNull(), ipHash: text("ip_hash").notNull(), successful: boolean("successful").notNull().default(false), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (t) => [index("es_login_attempts_rate_idx").on(t.emailHash, t.ipHash, t.createdAt)]);
export const jobs = pgTable("es_jobs", {
  id: uuid("id").primaryKey().defaultRandom(), publicCode: varchar("public_code", { length: 9 }).notNull().unique(), externalId: text("external_id"), slug: text("slug").notNull().unique(), originalTitle: text("original_title").notNull(), normalizedTitle: text("normalized_title").notNull(), companyId: uuid("company_id").notNull().references(() => companies.id), cityId: uuid("city_id").notNull().references(() => cities.id), stateId: uuid("state_id").notNull().references(() => states.id), categoryId: uuid("category_id").references(() => categories.id), neighborhoodId: uuid("neighborhood_id").references(() => neighborhoods.id), neighborhood: text("neighborhood"), workplaceType: text("workplace_type").notNull().default("presencial"), employmentType: text("employment_type").notNull(), numberOfOpenings: integer("number_of_openings").notNull().default(1), salaryMin: numeric("salary_min"), salaryMax: numeric("salary_max"), salaryCurrency: varchar("salary_currency", { length: 3 }).notNull().default("BRL"), salaryPeriod: text("salary_period"), salaryVisible: boolean("salary_visible").notNull().default(false), summary: text("summary").notNull(), description: text("description").notNull(), activities: jsonb("activities").notNull().default([]), requirements: jsonb("requirements").notNull().default([]), benefits: jsonb("benefits").notNull().default([]), schedule: text("schedule"), education: text("education"), experienceLevel: text("experience_level"), pcd: boolean("pcd").notNull().default(false), applicationType: text("application_type").notNull().default("URL"), applicationUrl: text("application_url").notNull(), applicationEmail: text("application_email"), applicationWhatsapp: text("application_whatsapp"), sourceUrl: text("source_url"), sourceName: text("source_name").notNull(), sourceEvidence: text("source_evidence"), originType: originType("origin_type").notNull(), duplicateHash: text("duplicate_hash").notNull(), verificationStatus: verificationStatus("verification_status").notNull().default("UNVERIFIED"), publicationStatus: publicationStatus("publication_status").notNull().default("DRAFT"), publishedAt: timestamp("published_at", { withTimezone: true }), scheduledAt: timestamp("scheduled_at", { withTimezone: true }), expiresAt: timestamp("expires_at", { withTimezone: true }), closedAt: timestamp("closed_at", { withTimezone: true }), closureReason: text("closure_reason"), version: integer("version").notNull().default(1), featured: boolean("featured").notNull().default(false), sponsored: boolean("sponsored").notNull().default(false), sponsorDisclosure: text("sponsor_disclosure"), ...timestamps
}, (t) => [index("es_jobs_publication_idx").on(t.publicationStatus, t.publishedAt), index("es_jobs_location_idx").on(t.stateId, t.cityId), uniqueIndex("es_jobs_external_source_uq").on(t.externalId, t.sourceName)]);
export const savedJobs = pgTable("es_saved_jobs", { userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), jobId: uuid("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (t) => [uniqueIndex("es_saved_jobs_uq").on(t.userId, t.jobId)]);
export const jobRevisions = pgTable("es_job_revisions", { id: uuid("id").primaryKey().defaultRandom(), jobId: uuid("job_id").notNull().references(() => jobs.id), version: integer("version").notNull(), snapshot: jsonb("snapshot").notNull(), actorId: uuid("actor_id").references(() => users.id), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (t) => [uniqueIndex("es_job_revisions_uq").on(t.jobId, t.version)]);
export const jobSources = pgTable("es_job_sources", { id: uuid("id").primaryKey().defaultRandom(), jobId: uuid("job_id").notNull().references(() => jobs.id), name: text("name").notNull(), url: text("url").notNull(), externalId: text("external_id"), evidence: text("evidence"), lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }), ...timestamps });
export const authors = pgTable("es_authors", { id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull(), slug: text("slug").notNull().unique(), bio: text("bio"), avatarUrl: text("avatar_url"), ...timestamps });
export const articles = pgTable("es_articles", { id: uuid("id").primaryKey().defaultRandom(), type: contentType("type").notNull(), authorId: uuid("author_id").notNull().references(() => authors.id), title: text("title").notNull(), subtitle: text("subtitle"), slug: text("slug").notNull().unique(), excerpt: text("excerpt").notNull(), contentHtml: text("content_html").notNull(), coverImageUrl: text("cover_image_url"), coverImageAlt: text("cover_image_alt"), coverImageCaption: text("cover_image_caption"), section: text("section"), tags: jsonb("tags").notNull().default([]), sourceName: text("source_name"), sourceUrl: text("source_url"), originalPublishedAt: timestamp("original_published_at", { withTimezone: true }), seoTitle: text("seo_title"), metaDescription: text("meta_description"), canonicalUrl: text("canonical_url"), internalNotes: text("internal_notes"), status: publicationStatus("status").notNull().default("DRAFT"), publishedAt: timestamp("published_at", { withTimezone: true }), scheduledAt: timestamp("scheduled_at", { withTimezone: true }), expiresAt: timestamp("expires_at", { withTimezone: true }), version: integer("version").notNull().default(1), featured: boolean("featured").notNull().default(false), ...timestamps }, (t) => [index("es_articles_publication_idx").on(t.status, t.publishedAt)]);
export const articleRevisions = pgTable("es_article_revisions", { id: uuid("id").primaryKey().defaultRandom(), articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }), version: integer("version").notNull(), snapshot: jsonb("snapshot").notNull(), actorId: uuid("actor_id").references(() => users.id), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (t) => [uniqueIndex("es_article_revisions_uq").on(t.articleId, t.version)]);
export const mediaAssets = pgTable("es_media_assets", { id: uuid("id").primaryKey().defaultRandom(), storageKey: text("storage_key").notNull().unique(), originalName: text("original_name").notNull(), mimeType: text("mime_type").notNull(), size: integer("size").notNull(), url: text("url").notNull(), altText: text("alt_text"), metadata: jsonb("metadata").notNull().default({}), ...timestamps });
export const redirects = pgTable("es_redirects", { id: uuid("id").primaryKey().defaultRandom(), sourcePath: text("source_path").notNull().unique(), destinationPath: text("destination_path").notNull(), statusCode: integer("status_code").notNull().default(301), active: boolean("active").notNull().default(true), ...timestamps });
export const importBatches = pgTable("es_import_batches", { id: uuid("id").primaryKey().defaultRandom(), fileHash: text("file_hash").notNull().unique(), fileName: text("file_name").notNull(), status: queueStatus("status").notNull().default("PENDING"), totalRows: integer("total_rows").notNull().default(0), validRows: integer("valid_rows").notNull().default(0), rejectedRows: integer("rejected_rows").notNull().default(0), settings: jsonb("settings").notNull().default({}), createdBy: uuid("created_by").references(() => users.id), undoneAt: timestamp("undone_at", { withTimezone: true }), undoneBy: uuid("undone_by").references(() => users.id), ...timestamps });
export const importMappingTemplates = pgTable("es_import_mapping_templates", { id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull().unique(), mapping: jsonb("mapping").notNull(), sheetName: text("sheet_name"), createdBy: uuid("created_by").references(() => users.id), ...timestamps });
export const importRows = pgTable("es_import_rows", { id: uuid("id").primaryKey().defaultRandom(), batchId: uuid("batch_id").notNull().references(() => importBatches.id), rowNumber: integer("row_number").notNull(), raw: jsonb("raw").notNull(), normalized: jsonb("normalized"), errors: jsonb("errors").notNull().default([]), action: text("action").notNull().default("REJECTED"), beforeSnapshot: jsonb("before_snapshot"), jobId: uuid("job_id").references(() => jobs.id), ...timestamps }, (t) => [uniqueIndex("es_import_rows_uq").on(t.batchId, t.rowNumber)]);
export const auditLogs = pgTable("es_audit_logs", { id: uuid("id").primaryKey().defaultRandom(), actorId: uuid("actor_id").references(() => users.id), action: text("action").notNull(), entityType: text("entity_type").notNull(), entityId: text("entity_id"), before: jsonb("before"), after: jsonb("after"), origin: text("origin").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const backgroundJobs = pgTable("es_background_jobs", { id: uuid("id").primaryKey().defaultRandom(), queue: text("queue").notNull(), name: text("name").notNull(), bullJobId: text("bull_job_id"), status: queueStatus("status").notNull().default("PENDING"), payload: jsonb("payload").notNull(), attempts: integer("attempts").notNull().default(0), error: text("error"), scheduledAt: timestamp("scheduled_at", { withTimezone: true }), finishedAt: timestamp("finished_at", { withTimezone: true }), ...timestamps });
export const publicationSchedules = pgTable("es_publication_schedules", { id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull(), status: text("status").notNull().default("ACTIVE"), configuration: jsonb("configuration").notNull(), jobIds: jsonb("job_ids").notNull(), preview: jsonb("preview").notNull(), createdBy: uuid("created_by").references(() => users.id), pausedAt: timestamp("paused_at", { withTimezone: true }), cancelledAt: timestamp("cancelled_at", { withTimezone: true }), ...timestamps });
export const shortLinks = pgTable("es_short_links", { id: uuid("id").primaryKey().defaultRandom(), code: varchar("code", { length: 9 }).notNull().unique(), destinationUrl: text("destination_url").notNull(), entityType: text("entity_type"), entityId: uuid("entity_id"), clicks: integer("clicks").notNull().default(0), active: boolean("active").notNull().default(true), ...timestamps });
export const socialPosts = pgTable("es_social_posts", { id: uuid("id").primaryKey().defaultRandom(), entityType: text("entity_type").notNull(), entityId: uuid("entity_id").notNull(), format: text("format").notNull(), caption: text("caption").notNull(), altText: text("alt_text").notNull(), imageKey: text("image_key"), autoPublish: boolean("auto_publish").notNull().default(false), status: queueStatus("status").notNull().default("PENDING"), scheduledAt: timestamp("scheduled_at", { withTimezone: true }), approvedBy: uuid("approved_by").references(() => users.id), ...timestamps });
export const socialPublications = pgTable("es_social_publications", { id: uuid("id").primaryKey().defaultRandom(), postId: uuid("post_id").notNull().references(() => socialPosts.id), provider: text("provider").notNull().default("META"), externalContainerId: text("external_container_id"), externalMediaId: text("external_media_id"), status: queueStatus("status").notNull().default("PENDING"), attempts: integer("attempts").notNull().default(0), error: text("error"), publishedAt: timestamp("published_at", { withTimezone: true }), ...timestamps });
export const subscriptions = pgTable("es_subscriptions", { id: uuid("id").primaryKey().defaultRandom(), email: text("email").notNull().unique(), status: text("status").notNull().default("PENDING"), preferences: jsonb("preferences").notNull().default({}), confirmationTokenHash: text("confirmation_token_hash"), unsubscribeTokenHash: text("unsubscribe_token_hash").notNull(), confirmedAt: timestamp("confirmed_at", { withTimezone: true }), unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }), ...timestamps });
export const alerts = pgTable("es_alerts", { id: uuid("id").primaryKey().defaultRandom(), subscriptionId: uuid("subscription_id").notNull().references(() => subscriptions.id), name: text("name").notNull(), filters: jsonb("filters").notNull(), frequency: text("frequency").notNull().default("DAILY"), active: boolean("active").notNull().default(true), ...timestamps });
export const notificationDeliveries = pgTable("es_notification_deliveries", { id: uuid("id").primaryKey().defaultRandom(), subscriptionId: uuid("subscription_id").references(() => subscriptions.id), channel: text("channel").notNull(), template: text("template").notNull(), providerId: text("provider_id"), status: queueStatus("status").notNull().default("PENDING"), error: text("error"), sentAt: timestamp("sent_at", { withTimezone: true }), ...timestamps });
export const consentLogs = pgTable("es_consent_logs", { id: uuid("id").primaryKey().defaultRandom(), subjectHash: text("subject_hash").notNull(), purpose: text("purpose").notNull(), action: text("action").notNull(), policyVersion: text("policy_version").notNull(), source: text("source").notNull(), ipHash: text("ip_hash"), userAgentHash: text("user_agent_hash"), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const advertisers = pgTable("es_advertisers", { id: uuid("id").primaryKey().defaultRandom(), name: text("name").notNull(), document: text("document"), contactEmail: text("contact_email").notNull(), active: boolean("active").notNull().default(true), ...timestamps });
export const campaigns = pgTable("es_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(), advertiserId: uuid("advertiser_id").notNull().references(() => advertisers.id), name: text("name").notNull(), sponsorName: text("sponsor_name"), status: text("status").notNull().default("DRAFT"), startsAt: timestamp("starts_at", { withTimezone: true }), endsAt: timestamp("ends_at", { withTimezone: true }), budget: numeric("budget"), priority: integer("priority").notNull().default(0), targeting: jsonb("targeting").notNull().default({}), impressionLimit: integer("impression_limit"), clickLimit: integer("click_limit"), internalNotes: text("internal_notes"), disclosure: text("disclosure").notNull().default("Publicidade"), ...timestamps
});
export const adSlots = pgTable("es_ad_slots", {
  id: uuid("id").primaryKey().defaultRandom(), key: text("key").notNull().unique(), name: text("name").notNull().default(""), pageType: text("page_type").notNull(), position: text("position").notNull(), device: text("device").notNull().default("all"), width: integer("width"), height: integer("height"), active: boolean("active").notNull().default(false), priority: integer("priority").notNull().default(0), allowAdsense: boolean("allow_adsense").notNull().default(true), allowDirect: boolean("allow_direct").notNull().default(true), adsenseSlotId: text("adsense_slot_id"), exclusionRules: jsonb("exclusion_rules").notNull().default({}), reservedHeight: integer("reserved_height").notNull().default(280), sortOrder: integer("sort_order").notNull().default(0), ...timestamps
});
export const adCreatives = pgTable("es_ad_creatives", {
  id: uuid("id").primaryKey().defaultRandom(), campaignId: uuid("campaign_id").notNull().references(() => campaigns.id), slotId: uuid("slot_id").notNull().references(() => adSlots.id), name: text("name").notNull().default(""), imageUrl: text("image_url").notNull(), destinationUrl: text("destination_url").notNull(), altText: text("alt_text").notNull(), active: boolean("active").notNull().default(true), priority: integer("priority").notNull().default(0), status: text("status").notNull().default("DRAFT"), ...timestamps
});
export const adEvents = pgTable("es_ad_events", {
  id: uuid("id").primaryKey().defaultRandom(), creativeId: uuid("creative_id").references(() => adCreatives.id), campaignId: uuid("campaign_id").references(() => campaigns.id), slotKey: text("slot_key").notNull(), event: text("event").notNull(), path: text("path").notNull(), device: text("device"), citySlug: text("city_slug"), categorySlug: text("category_slug"), entityType: text("entity_type"), entityId: uuid("entity_id"), referrer: text("referrer"), visitorHash: text("visitor_hash"), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => [index("es_ad_events_reporting_idx").on(t.slotKey, t.event, t.createdAt), index("es_ad_events_campaign_idx").on(t.campaignId, t.event, t.createdAt)]);
export const indexingEvents = pgTable("es_indexing_events", { id: uuid("id").primaryKey().defaultRandom(), dedupeKey: text("dedupe_key").notNull().unique(), jobId: uuid("job_id").references(() => jobs.id), provider: text("provider").notNull(), url: text("url").notNull(), notificationType: text("notification_type").notNull(), status: queueStatus("status").notNull().default("PENDING"), attempts: integer("attempts").notNull().default(0), response: jsonb("response"), error: text("error"), processedAt: timestamp("processed_at", { withTimezone: true }), ...timestamps }, (t) => [index("es_indexing_event_queue_idx").on(t.status, t.createdAt)]);
export const settings = pgTable("es_system_settings", { key: text("key").primaryKey(), value: jsonb("value").notNull(), public: boolean("public").notNull().default(false), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow() });

export const contactStatus = pgEnum("es_contact_status", ["OPEN", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]);
export const orderStatus = pgEnum("es_order_status", ["DRAFT", "PENDING_PAYMENT", "PAID", "CANCELLED", "EXPIRED", "MANUAL_REVIEW"]);
export const companyUserRole = pgEnum("es_company_user_role", ["OWNER", "MANAGER", "RECRUITER", "BILLING", "VIEWER"]);
export const refundStatus = pgEnum("es_refund_status", ["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED", "REJECTED", "FAILED"]);
export const ticketStatus = pgEnum("es_ticket_status", ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]);

export const contactSubmissions = pgTable("es_contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  protocol: varchar("protocol", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  status: contactStatus("status").notNull().default("OPEN"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  internalNotes: text("internal_notes"),
  ipHash: text("ip_hash"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  ...timestamps
}, (t) => [index("es_contact_submissions_status_idx").on(t.status, t.createdAt)]);

export const commercialPlans = pgTable("es_commercial_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull(),
  fullDescriptionHtml: text("full_description_html"),
  price: numeric("price").notNull().default("0"),
  promoPrice: numeric("promo_price"),
  currency: varchar("currency", { length: 3 }).notNull().default("BRL"),
  jobCredits: integer("job_credits").notNull().default(1),
  durationDays: integer("duration_days").notNull().default(30),
  highlightDays: integer("highlight_days").notNull().default(0),
  publishStories: boolean("publish_stories").notNull().default(false),
  publishFeed: boolean("publish_feed").notNull().default(false),
  publishSite: boolean("publish_site").notNull().default(true),
  postsCount: integer("posts_count").notNull().default(0),
  renewable: boolean("renewable").notNull().default(true),
  billingType: text("billing_type").notNull().default("one_time"),
  creditValidityDays: integer("credit_validity_days").notNull().default(365),
  promoStartsAt: timestamp("promo_starts_at", { withTimezone: true }),
  promoEndsAt: timestamp("promo_ends_at", { withTimezone: true }),
  priority: integer("priority").notNull().default(0),
  active: boolean("active").notNull().default(false),
  setupRequired: boolean("setup_required").notNull().default(true),
  archived: boolean("archived").notNull().default(false),
  recommended: boolean("recommended").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  benefits: jsonb("benefits").notNull().default([]),
  limitations: jsonb("limitations").notNull().default([]),
  rules: text("rules"),
  ...timestamps
});

export const commercialOrders = pgTable("es_commercial_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderCode: varchar("order_code", { length: 24 }).notNull().unique(),
  planId: uuid("plan_id").notNull().references(() => commercialPlans.id),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  cnpj: text("cnpj"),
  city: text("city").notNull(),
  billingData: jsonb("billing_data").notNull().default({}),
  amount: numeric("amount").notNull(),
  status: orderStatus("status").notNull().default("PENDING_PAYMENT"),
  companyId: uuid("company_id").references(() => companies.id),
  internalNotes: text("internal_notes"),
  timeline: jsonb("timeline").notNull().default([]),
  cancelReason: text("cancel_reason"),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...timestamps
}, (t) => [index("es_commercial_orders_status_idx").on(t.status, t.createdAt), index("es_commercial_orders_email_idx").on(t.email)]);

export const commercialPayments = pgTable("es_commercial_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => commercialOrders.id),
  externalId: text("external_id"),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  amount: numeric("amount").notNull(),
  method: text("method").notNull(),
  provider: text("provider").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("CREATED"),
  attemptCount: integer("attempt_count").notNull().default(0),
  lastError: text("last_error"),
  metadata: jsonb("metadata").notNull().default({}),
  webhookPayload: jsonb("webhook_payload"),
  manualReason: text("manual_reason"),
  manualProofUrl: text("manual_proof_url"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  refusedAt: timestamp("refused_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  ...timestamps
}, (t) => [index("es_commercial_payments_order_idx").on(t.orderId, t.status), index("es_commercial_payments_status_idx").on(t.status, t.createdAt)]);

export const commercialPaymentEvents = pgTable("es_commercial_payment_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").references(() => commercialPayments.id),
  orderId: uuid("order_id").references(() => commercialOrders.id),
  eventType: text("event_type").notNull(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  payload: jsonb("payload").notNull().default({}),
  processed: boolean("processed").notNull().default(false),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (t) => [index("es_commercial_payment_events_payment_idx").on(t.paymentId, t.createdAt)]);

export const commercialRefunds = pgTable("es_commercial_refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  paymentId: uuid("payment_id").notNull().references(() => commercialPayments.id),
  orderId: uuid("order_id").notNull().references(() => commercialOrders.id),
  amount: numeric("amount").notNull(),
  status: refundStatus("status").notNull().default("REQUESTED"),
  reason: text("reason").notNull(),
  partial: boolean("partial").notNull().default(false),
  approvedBy: uuid("approved_by").references(() => users.id),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  metadata: jsonb("metadata").notNull().default({}),
  ...timestamps
}, (t) => [index("es_commercial_refunds_order_idx").on(t.orderId, t.status)]);

export const companyCredits = pgTable("es_company_credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),
  orderId: uuid("order_id").references(() => commercialOrders.id),
  email: text("email").notNull(),
  planId: uuid("plan_id").references(() => commercialPlans.id),
  totalCredits: integer("total_credits").notNull(),
  usedCredits: integer("used_credits").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  grantedBy: uuid("granted_by").references(() => users.id),
  ...timestamps
}, (t) => [index("es_company_credits_email_idx").on(t.email), index("es_company_credits_company_idx").on(t.companyId)]);

export const companyAccounts = pgTable("es_company_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash"),
  role: companyUserRole("role").notNull().default("OWNER"),
  active: boolean("active").notNull().default(true),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  inviteTokenHash: text("invite_token_hash"),
  inviteExpiresAt: timestamp("invite_expires_at", { withTimezone: true }),
  ...timestamps
}, (t) => [index("es_company_accounts_company_idx").on(t.companyId)]);

export const companySessions = pgTable("es_company_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").notNull().references(() => companyAccounts.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  ipHash: text("ip_hash"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ...timestamps
});

export const companyJobDrafts = pgTable("es_company_job_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => companyAccounts.id),
  orderId: uuid("order_id").references(() => commercialOrders.id),
  creditId: uuid("credit_id").references(() => companyCredits.id),
  companyId: uuid("company_id").references(() => companies.id),
  jobTitle: text("job_title").notNull(),
  description: text("description").notNull(),
  applyUrl: text("apply_url").notNull(),
  status: text("status").notNull().default("DRAFT"),
  adminFeedback: text("admin_feedback"),
  jobId: uuid("job_id").references(() => jobs.id),
  ...timestamps
}, (t) => [index("es_company_job_drafts_status_idx").on(t.status, t.createdAt)]);

export const companyTickets = pgTable("es_company_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => companyAccounts.id),
  companyId: uuid("company_id").references(() => companies.id),
  orderId: uuid("order_id").references(() => commercialOrders.id),
  paymentId: uuid("payment_id").references(() => commercialPayments.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: ticketStatus("status").notNull().default("OPEN"),
  protocol: varchar("protocol", { length: 20 }).notNull().unique(),
  ...timestamps
}, (t) => [index("es_company_tickets_status_idx").on(t.status, t.createdAt)]);

export const seoAuditIssues = pgTable("es_seo_audit_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  url: text("url").notNull(),
  checkKey: text("check_key").notNull(),
  severity: text("severity").notNull(),
  scoreImpact: integer("score_impact").notNull().default(0),
  message: text("message").notNull(),
  recommendation: text("recommendation"),
  resolved: boolean("resolved").notNull().default(false),
  ignored: boolean("ignored").notNull().default(false),
  ignoreReason: text("ignore_reason"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps
}, (t) => [index("es_seo_audit_issues_url_idx").on(t.url, t.checkKey), index("es_seo_audit_issues_open_idx").on(t.resolved, t.ignored, t.severity)]);

export const jobRelations = relations(jobs, ({ one, many }) => ({ company: one(companies, { fields: [jobs.companyId], references: [companies.id] }), city: one(cities, { fields: [jobs.cityId], references: [cities.id] }), revisions: many(jobRevisions), sources: many(jobSources) }));
export const activePublishedJobs = sql`${jobs.publicationStatus} = 'PUBLISHED' and ${jobs.expiresAt} > now()`;
