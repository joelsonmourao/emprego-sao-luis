CREATE TABLE "es_ad_creatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"slot_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"destination_url" text NOT NULL,
	"alt_text" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_ad_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creative_id" uuid,
	"slot_key" text NOT NULL,
	"event" text NOT NULL,
	"path" text NOT NULL,
	"visitor_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_ad_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"page_type" text NOT NULL,
	"position" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"reserved_height" integer DEFAULT 280 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_ad_slots_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "es_advertisers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"document" text,
	"contact_email" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"advertiser_id" uuid NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"budget" numeric,
	"disclosure" text DEFAULT 'Publicidade' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "es_ad_creatives" ADD CONSTRAINT "es_ad_creatives_campaign_id_es_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."es_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_ad_creatives" ADD CONSTRAINT "es_ad_creatives_slot_id_es_ad_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."es_ad_slots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD CONSTRAINT "es_ad_events_creative_id_es_ad_creatives_id_fk" FOREIGN KEY ("creative_id") REFERENCES "public"."es_ad_creatives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD CONSTRAINT "es_campaigns_advertiser_id_es_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."es_advertisers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "es_ad_events_reporting_idx" ON "es_ad_events" USING btree ("slot_key","event","created_at");