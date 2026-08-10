CREATE TABLE "es_neighborhoods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "es_categories" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "normalized_name" text;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "ibge_code" text;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "metropolitan_region" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "es_cities" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "normalized_name" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "legal_name" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "city_id" uuid;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "whatsapp" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "contact_email" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "sponsored" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "es_companies" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN "neighborhood_id" uuid;--> statement-breakpoint
ALTER TABLE "es_neighborhoods" ADD CONSTRAINT "es_neighborhoods_city_id_es_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."es_cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "es_neighborhoods_city_slug_uq" ON "es_neighborhoods" USING btree ("city_id","slug");--> statement-breakpoint
ALTER TABLE "es_companies" ADD CONSTRAINT "es_companies_city_id_es_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."es_cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD CONSTRAINT "es_jobs_neighborhood_id_es_neighborhoods_id_fk" FOREIGN KEY ("neighborhood_id") REFERENCES "public"."es_neighborhoods"("id") ON DELETE no action ON UPDATE no action;