CREATE TYPE "public"."es_contact_status" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."es_payment_status" AS ENUM('PENDING', 'APPROVED', 'REFUSED', 'CANCELLED', 'REFUNDED', 'EXPIRED', 'MANUAL_APPROVED');--> statement-breakpoint
CREATE TYPE "public"."es_order_status" AS ENUM('DRAFT', 'PENDING_PAYMENT', 'PAID', 'CANCELLED', 'EXPIRED');--> statement-breakpoint
CREATE TABLE "es_contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"category" text NOT NULL,
	"message" text NOT NULL,
	"status" "es_contact_status" DEFAULT 'OPEN' NOT NULL,
	"assigned_to" uuid,
	"internal_notes" text,
	"ip_hash" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_contact_submissions_protocol_unique" UNIQUE("protocol")
);--> statement-breakpoint
CREATE TABLE "es_commercial_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"promo_price" numeric,
	"job_credits" integer DEFAULT 1 NOT NULL,
	"duration_days" integer DEFAULT 30 NOT NULL,
	"highlight_days" integer DEFAULT 0 NOT NULL,
	"publish_stories" boolean DEFAULT false NOT NULL,
	"publish_feed" boolean DEFAULT false NOT NULL,
	"publish_site" boolean DEFAULT true NOT NULL,
	"renewable" boolean DEFAULT true NOT NULL,
	"credit_validity_days" integer DEFAULT 365 NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"recommended" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"limitations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rules" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_commercial_plans_slug_unique" UNIQUE("slug")
);--> statement-breakpoint
CREATE TABLE "es_commercial_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_code" varchar(24) NOT NULL,
	"plan_id" uuid NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text,
	"cnpj" text,
	"city" text NOT NULL,
	"billing_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"amount" numeric NOT NULL,
	"status" "es_order_status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"company_id" uuid,
	"expires_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_commercial_orders_order_code_unique" UNIQUE("order_code")
);--> statement-breakpoint
CREATE TABLE "es_commercial_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"external_id" text,
	"idempotency_key" text NOT NULL,
	"amount" numeric NOT NULL,
	"method" text NOT NULL,
	"provider" text NOT NULL,
	"status" "es_payment_status" DEFAULT 'PENDING' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"webhook_payload" jsonb,
	"approved_at" timestamp with time zone,
	"refused_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_commercial_payments_idempotency_key_unique" UNIQUE("idempotency_key")
);--> statement-breakpoint
CREATE TABLE "es_company_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"order_id" uuid,
	"email" text NOT NULL,
	"plan_id" uuid,
	"total_credits" integer NOT NULL,
	"used_credits" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "es_contact_submissions" ADD CONSTRAINT "es_contact_submissions_assigned_to_es_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_orders" ADD CONSTRAINT "es_commercial_orders_plan_id_es_commercial_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."es_commercial_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_orders" ADD CONSTRAINT "es_commercial_orders_company_id_es_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."es_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD CONSTRAINT "es_commercial_payments_order_id_es_commercial_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."es_commercial_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_credits" ADD CONSTRAINT "es_company_credits_company_id_es_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."es_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_credits" ADD CONSTRAINT "es_company_credits_order_id_es_commercial_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."es_commercial_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_credits" ADD CONSTRAINT "es_company_credits_plan_id_es_commercial_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."es_commercial_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "es_contact_submissions_status_idx" ON "es_contact_submissions" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "es_commercial_orders_status_idx" ON "es_commercial_orders" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "es_commercial_payments_order_idx" ON "es_commercial_payments" USING btree ("order_id","status");--> statement-breakpoint
CREATE INDEX "es_company_credits_email_idx" ON "es_company_credits" USING btree ("email");
