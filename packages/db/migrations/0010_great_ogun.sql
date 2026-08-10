CREATE TABLE "es_candidate_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_candidate_sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "es_magic_link_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_magic_link_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "es_saved_jobs" (
	"user_id" uuid NOT NULL,
	"job_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_user_job_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"cities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"categories" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"workplace_types" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"email_alerts" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "es_candidate_sessions" ADD CONSTRAINT "es_candidate_sessions_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_magic_link_tokens" ADD CONSTRAINT "es_magic_link_tokens_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_saved_jobs" ADD CONSTRAINT "es_saved_jobs_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_saved_jobs" ADD CONSTRAINT "es_saved_jobs_job_id_es_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."es_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_user_job_preferences" ADD CONSTRAINT "es_user_job_preferences_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "es_saved_jobs_uq" ON "es_saved_jobs" USING btree ("user_id","job_id");