CREATE TABLE "es_article_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"actor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "subtitle" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "cover_image_alt" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "cover_image_caption" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "section" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "source_name" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "original_published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "internal_notes" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "scheduled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_article_revisions" ADD CONSTRAINT "es_article_revisions_article_id_es_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."es_articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_article_revisions" ADD CONSTRAINT "es_article_revisions_actor_id_es_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "es_article_revisions_uq" ON "es_article_revisions" USING btree ("article_id","version");--> statement-breakpoint
CREATE INDEX "es_articles_publication_idx" ON "es_articles" USING btree ("status","published_at");