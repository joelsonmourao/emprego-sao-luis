CREATE TABLE "es_short_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(9) NOT NULL,
	"destination_url" text NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"clicks" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_short_links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "es_social_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"format" text NOT NULL,
	"caption" text NOT NULL,
	"alt_text" text NOT NULL,
	"image_key" text,
	"status" "es_queue_status" DEFAULT 'PENDING' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_social_publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"provider" text DEFAULT 'META' NOT NULL,
	"external_container_id" text,
	"external_media_id" text,
	"status" "es_queue_status" DEFAULT 'PENDING' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "es_social_posts" ADD CONSTRAINT "es_social_posts_approved_by_es_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_social_publications" ADD CONSTRAINT "es_social_publications_post_id_es_social_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."es_social_posts"("id") ON DELETE no action ON UPDATE no action;