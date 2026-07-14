ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "cover_image_credit" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "cover_image_width" integer;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "cover_image_height" integer;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "cover_image_variants" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "og_image_url" text;
