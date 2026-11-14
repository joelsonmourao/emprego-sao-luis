CREATE TABLE "es_publication_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"configuration" jsonb NOT NULL,
	"job_ids" jsonb NOT NULL,
	"preview" jsonb NOT NULL,
	"created_by" uuid,
	"paused_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "es_publication_schedules" ADD CONSTRAINT "es_publication_schedules_created_by_es_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;