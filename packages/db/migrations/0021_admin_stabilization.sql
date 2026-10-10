ALTER TABLE "es_companies" ADD COLUMN IF NOT EXISTS "public_name" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "additional_info" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "confidential_company" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "seo_title" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "meta_description" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "canonical_url" text;
