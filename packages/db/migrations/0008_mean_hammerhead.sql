CREATE TABLE "es_indexing_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dedupe_key" text NOT NULL,
	"job_id" uuid,
	"provider" text NOT NULL,
	"url" text NOT NULL,
	"notification_type" text NOT NULL,
	"status" "es_queue_status" DEFAULT 'PENDING' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"response" jsonb,
	"error" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_indexing_events_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
ALTER TABLE "es_indexing_events" ADD CONSTRAINT "es_indexing_events_job_id_es_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."es_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "es_indexing_event_queue_idx" ON "es_indexing_events" USING btree ("status","created_at");