CREATE TYPE "public"."es_content_type" AS ENUM('NEWS', 'GUIDE', 'DATA_REPORT');--> statement-breakpoint
CREATE TYPE "public"."es_origin_type" AS ENUM('MANUAL', 'SPREADSHEET', 'API', 'COMPANY_SUBMISSION', 'INTERNAL_IMPORT', 'OFFICIAL_SOURCE', 'PARTNER');--> statement-breakpoint
CREATE TYPE "public"."es_publication_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'PAUSED', 'EXPIRED', 'CLOSED', 'REJECTED', 'DUPLICATE', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."es_queue_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."es_verification_status" AS ENUM('UNVERIFIED', 'SOURCE_CONFIRMED', 'COMPANY_VERIFIED', 'LINK_CONFIRMED', 'NEEDS_REVIEW', 'FAILED');--> statement-breakpoint
CREATE TABLE "es_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "es_content_type" NOT NULL,
	"author_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"content_html" text NOT NULL,
	"cover_image_url" text,
	"status" "es_publication_status" DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "es_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"before" jsonb,
	"after" jsonb,
	"origin" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"bio" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "es_background_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"queue" text NOT NULL,
	"name" text NOT NULL,
	"bull_job_id" text,
	"status" "es_queue_status" DEFAULT 'PENDING' NOT NULL,
	"payload" jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error" text,
	"scheduled_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "es_cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"state_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"latitude" numeric,
	"longitude" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"website_url" text,
	"logo_url" text,
	"description_html" text,
	"verified_at" timestamp with time zone,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "es_import_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_hash" text NOT NULL,
	"file_name" text NOT NULL,
	"status" "es_queue_status" DEFAULT 'PENDING' NOT NULL,
	"total_rows" integer DEFAULT 0 NOT NULL,
	"valid_rows" integer DEFAULT 0 NOT NULL,
	"rejected_rows" integer DEFAULT 0 NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_import_batches_file_hash_unique" UNIQUE("file_hash")
);
--> statement-breakpoint
CREATE TABLE "es_import_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"row_number" integer NOT NULL,
	"raw" jsonb NOT NULL,
	"normalized" jsonb,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"job_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_job_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"snapshot" jsonb NOT NULL,
	"actor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_job_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"external_id" text,
	"evidence" text,
	"last_checked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_code" varchar(9) NOT NULL,
	"external_id" text,
	"slug" text NOT NULL,
	"original_title" text NOT NULL,
	"normalized_title" text NOT NULL,
	"company_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"state_id" uuid NOT NULL,
	"category_id" uuid,
	"neighborhood" text,
	"workplace_type" text DEFAULT 'presencial' NOT NULL,
	"employment_type" text NOT NULL,
	"number_of_openings" integer DEFAULT 1 NOT NULL,
	"salary_min" numeric,
	"salary_max" numeric,
	"salary_currency" varchar(3) DEFAULT 'BRL' NOT NULL,
	"salary_period" text,
	"salary_visible" boolean DEFAULT false NOT NULL,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"activities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"schedule" text,
	"education" text,
	"experience_level" text,
	"pcd" boolean DEFAULT false NOT NULL,
	"application_type" text DEFAULT 'URL' NOT NULL,
	"application_url" text NOT NULL,
	"application_email" text,
	"application_whatsapp" text,
	"source_url" text,
	"source_name" text NOT NULL,
	"source_evidence" text,
	"origin_type" "es_origin_type" NOT NULL,
	"duplicate_hash" text NOT NULL,
	"verification_status" "es_verification_status" DEFAULT 'UNVERIFIED' NOT NULL,
	"publication_status" "es_publication_status" DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"closure_reason" text,
	"version" integer DEFAULT 1 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sponsored" boolean DEFAULT false NOT NULL,
	"sponsor_disclosure" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_jobs_public_code_unique" UNIQUE("public_code"),
	CONSTRAINT "es_jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "es_media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"url" text NOT NULL,
	"alt_text" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_media_assets_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "es_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "es_redirects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_path" text NOT NULL,
	"destination_path" text NOT NULL,
	"status_code" integer DEFAULT 301 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_redirects_source_path_unique" UNIQUE("source_path")
);
--> statement-breakpoint
CREATE TABLE "es_role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_roles_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "es_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "es_system_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legacy_id" text,
	"code" varchar(2) NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_states_legacy_id_unique" UNIQUE("legacy_id"),
	CONSTRAINT "es_states_code_unique" UNIQUE("code"),
	CONSTRAINT "es_states_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "es_user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text,
	"email_verified_at" timestamp with time zone,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "es_articles" ADD CONSTRAINT "es_articles_author_id_es_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."es_authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_audit_logs" ADD CONSTRAINT "es_audit_logs_actor_id_es_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_cities" ADD CONSTRAINT "es_cities_state_id_es_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."es_states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_import_batches" ADD CONSTRAINT "es_import_batches_created_by_es_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD CONSTRAINT "es_import_rows_batch_id_es_import_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."es_import_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD CONSTRAINT "es_import_rows_job_id_es_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."es_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_job_revisions" ADD CONSTRAINT "es_job_revisions_job_id_es_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."es_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_job_revisions" ADD CONSTRAINT "es_job_revisions_actor_id_es_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_job_sources" ADD CONSTRAINT "es_job_sources_job_id_es_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."es_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD CONSTRAINT "es_jobs_company_id_es_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."es_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD CONSTRAINT "es_jobs_city_id_es_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."es_cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD CONSTRAINT "es_jobs_state_id_es_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."es_states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD CONSTRAINT "es_jobs_category_id_es_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."es_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_role_permissions" ADD CONSTRAINT "es_role_permissions_role_id_es_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."es_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_role_permissions" ADD CONSTRAINT "es_role_permissions_permission_id_es_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."es_permissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_sessions" ADD CONSTRAINT "es_sessions_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_user_roles" ADD CONSTRAINT "es_user_roles_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_user_roles" ADD CONSTRAINT "es_user_roles_role_id_es_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."es_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "es_cities_state_slug_uq" ON "es_cities" USING btree ("state_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "es_import_rows_uq" ON "es_import_rows" USING btree ("batch_id","row_number");--> statement-breakpoint
CREATE UNIQUE INDEX "es_job_revisions_uq" ON "es_job_revisions" USING btree ("job_id","version");--> statement-breakpoint
CREATE INDEX "es_jobs_publication_idx" ON "es_jobs" USING btree ("publication_status","published_at");--> statement-breakpoint
CREATE INDEX "es_jobs_location_idx" ON "es_jobs" USING btree ("state_id","city_id");--> statement-breakpoint
CREATE UNIQUE INDEX "es_jobs_external_source_uq" ON "es_jobs" USING btree ("external_id","source_name");--> statement-breakpoint
CREATE UNIQUE INDEX "es_role_permissions_uq" ON "es_role_permissions" USING btree ("role_id","permission_id");--> statement-breakpoint
CREATE UNIQUE INDEX "es_user_roles_uq" ON "es_user_roles" USING btree ("user_id","role_id");