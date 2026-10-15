ALTER TABLE "es_import_batches" ADD COLUMN "undone_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "es_import_batches" ADD COLUMN "undone_by" uuid;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN "action" text DEFAULT 'REJECTED' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN "before_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "es_import_batches" ADD CONSTRAINT "es_import_batches_undone_by_es_users_id_fk" FOREIGN KEY ("undone_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;