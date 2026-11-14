ALTER TABLE "es_ad_slots" ADD COLUMN "name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "device" text DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "priority" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "allow_adsense" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "allow_direct" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "adsense_slot_id" text;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "exclusion_rules" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_slots" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD COLUMN "sponsor_name" text;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD COLUMN "priority" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD COLUMN "targeting" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD COLUMN "impression_limit" integer;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD COLUMN "click_limit" integer;--> statement-breakpoint
ALTER TABLE "es_campaigns" ADD COLUMN "internal_notes" text;--> statement-breakpoint
ALTER TABLE "es_ad_creatives" ADD COLUMN "name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_creatives" ADD COLUMN "priority" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_creatives" ADD COLUMN "status" text DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "campaign_id" uuid;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "city_slug" text;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "category_slug" text;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "entity_type" text;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "entity_id" uuid;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD COLUMN "referrer" text;--> statement-breakpoint
ALTER TABLE "es_ad_events" ADD CONSTRAINT "es_ad_events_campaign_id_es_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."es_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "es_ad_events_campaign_idx" ON "es_ad_events" USING btree ("campaign_id","event","created_at");
