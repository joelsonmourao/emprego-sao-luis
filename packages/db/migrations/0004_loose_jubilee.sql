CREATE TABLE "es_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid NOT NULL,
	"name" text NOT NULL,
	"filters" jsonb NOT NULL,
	"frequency" text DEFAULT 'DAILY' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_consent_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_hash" text NOT NULL,
	"purpose" text NOT NULL,
	"action" text NOT NULL,
	"policy_version" text NOT NULL,
	"source" text NOT NULL,
	"ip_hash" text,
	"user_agent_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_notification_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscription_id" uuid,
	"channel" text NOT NULL,
	"template" text NOT NULL,
	"provider_id" text,
	"status" "es_queue_status" DEFAULT 'PENDING' NOT NULL,
	"error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "es_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"confirmation_token_hash" text,
	"unsubscribe_token_hash" text NOT NULL,
	"confirmed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_subscriptions_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "es_alerts" ADD CONSTRAINT "es_alerts_subscription_id_es_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."es_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_notification_deliveries" ADD CONSTRAINT "es_notification_deliveries_subscription_id_es_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."es_subscriptions"("id") ON DELETE no action ON UPDATE no action;