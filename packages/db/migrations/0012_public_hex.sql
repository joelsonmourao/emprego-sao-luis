CREATE TABLE "es_import_mapping_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"mapping" jsonb NOT NULL,
	"sheet_name" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_import_mapping_templates_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "es_import_mapping_templates" ADD CONSTRAINT "es_import_mapping_templates_created_by_es_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;