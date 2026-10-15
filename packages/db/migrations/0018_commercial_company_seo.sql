ALTER TYPE "es_order_status" ADD VALUE IF NOT EXISTS 'MANUAL_REVIEW';--> statement-breakpoint
CREATE TYPE "public"."es_company_user_role" AS ENUM('OWNER', 'MANAGER', 'RECRUITER', 'BILLING', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."es_refund_status" AS ENUM('REQUESTED', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."es_ticket_status" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "short_description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "full_description_html" text;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "currency" varchar(3) DEFAULT 'BRL' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "posts_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "billing_type" text DEFAULT 'one_time' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "promo_starts_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "promo_ends_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "setup_required" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ALTER COLUMN "active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ALTER COLUMN "price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "es_commercial_orders" ADD COLUMN "internal_notes" text;--> statement-breakpoint
ALTER TABLE "es_commercial_orders" ADD COLUMN "timeline" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_orders" ADD COLUMN "cancel_reason" text;--> statement-breakpoint
ALTER TABLE "es_commercial_orders" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "es_commercial_orders_email_idx" ON "es_commercial_orders" USING btree ("email");--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD COLUMN "attempt_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD COLUMN "last_error" text;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD COLUMN "manual_reason" text;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD COLUMN "manual_proof_url" text;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ALTER COLUMN "status" TYPE varchar(32) USING (
  CASE status::text
    WHEN 'APPROVED' THEN 'PAID'
    WHEN 'MANUAL_APPROVED' THEN 'PAID'
    WHEN 'REFUSED' THEN 'FAILED'
    ELSE status::text
  END
);--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ALTER COLUMN "status" SET DEFAULT 'CREATED';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "es_commercial_payments_status_idx" ON "es_commercial_payments" USING btree ("status","created_at");--> statement-breakpoint
ALTER TABLE "es_commercial_payments" ADD CONSTRAINT "es_commercial_payments_approved_by_es_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_credits" ADD COLUMN "granted_by" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "es_company_credits_company_idx" ON "es_company_credits" USING btree ("company_id");--> statement-breakpoint
ALTER TABLE "es_company_credits" ADD CONSTRAINT "es_company_credits_granted_by_es_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE TABLE "es_commercial_payment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid,
	"order_id" uuid,
	"event_type" text NOT NULL,
	"idempotency_key" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_commercial_payment_events_idempotency_key_unique" UNIQUE("idempotency_key")
);--> statement-breakpoint
CREATE TABLE "es_commercial_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" numeric NOT NULL,
	"status" "es_refund_status" DEFAULT 'REQUESTED' NOT NULL,
	"reason" text NOT NULL,
	"partial" boolean DEFAULT false NOT NULL,
	"approved_by" uuid,
	"processed_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "es_company_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text,
	"role" "es_company_user_role" DEFAULT 'OWNER' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"email_verified_at" timestamp with time zone,
	"invite_token_hash" text,
	"invite_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_company_accounts_email_unique" UNIQUE("email")
);--> statement-breakpoint
CREATE TABLE "es_company_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"ip_hash" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_company_sessions_token_hash_unique" UNIQUE("token_hash")
);--> statement-breakpoint
CREATE TABLE "es_company_job_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"order_id" uuid,
	"credit_id" uuid,
	"company_id" uuid,
	"job_title" text NOT NULL,
	"description" text NOT NULL,
	"apply_url" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"admin_feedback" text,
	"job_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE "es_company_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"company_id" uuid,
	"order_id" uuid,
	"payment_id" uuid,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" "es_ticket_status" DEFAULT 'OPEN' NOT NULL,
	"protocol" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_company_tickets_protocol_unique" UNIQUE("protocol")
);--> statement-breakpoint
CREATE TABLE "es_seo_audit_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"url" text NOT NULL,
	"check_key" text NOT NULL,
	"severity" text NOT NULL,
	"score_impact" integer DEFAULT 0 NOT NULL,
	"message" text NOT NULL,
	"recommendation" text,
	"resolved" boolean DEFAULT false NOT NULL,
	"ignored" boolean DEFAULT false NOT NULL,
	"ignore_reason" text,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "es_commercial_payment_events" ADD CONSTRAINT "es_commercial_payment_events_payment_id_es_commercial_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."es_commercial_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_payment_events" ADD CONSTRAINT "es_commercial_payment_events_order_id_es_commercial_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."es_commercial_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_refunds" ADD CONSTRAINT "es_commercial_refunds_payment_id_es_commercial_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."es_commercial_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_refunds" ADD CONSTRAINT "es_commercial_refunds_order_id_es_commercial_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."es_commercial_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_commercial_refunds" ADD CONSTRAINT "es_commercial_refunds_approved_by_es_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."es_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_accounts" ADD CONSTRAINT "es_company_accounts_company_id_es_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."es_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_sessions" ADD CONSTRAINT "es_company_sessions_account_id_es_company_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."es_company_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_job_drafts" ADD CONSTRAINT "es_company_job_drafts_account_id_es_company_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."es_company_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_job_drafts" ADD CONSTRAINT "es_company_job_drafts_order_id_es_commercial_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."es_commercial_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_job_drafts" ADD CONSTRAINT "es_company_job_drafts_credit_id_es_company_credits_id_fk" FOREIGN KEY ("credit_id") REFERENCES "public"."es_company_credits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_job_drafts" ADD CONSTRAINT "es_company_job_drafts_company_id_es_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."es_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_job_drafts" ADD CONSTRAINT "es_company_job_drafts_job_id_es_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."es_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_tickets" ADD CONSTRAINT "es_company_tickets_account_id_es_company_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."es_company_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_tickets" ADD CONSTRAINT "es_company_tickets_company_id_es_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."es_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_tickets" ADD CONSTRAINT "es_company_tickets_order_id_es_commercial_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."es_commercial_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "es_company_tickets" ADD CONSTRAINT "es_company_tickets_payment_id_es_commercial_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."es_commercial_payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "es_commercial_payment_events_payment_idx" ON "es_commercial_payment_events" USING btree ("payment_id","created_at");--> statement-breakpoint
CREATE INDEX "es_commercial_refunds_order_idx" ON "es_commercial_refunds" USING btree ("order_id","status");--> statement-breakpoint
CREATE INDEX "es_company_accounts_company_idx" ON "es_company_accounts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "es_company_job_drafts_status_idx" ON "es_company_job_drafts" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "es_company_tickets_status_idx" ON "es_company_tickets" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "es_seo_audit_issues_url_idx" ON "es_seo_audit_issues" USING btree ("url","check_key");--> statement-breakpoint
CREATE INDEX "es_seo_audit_issues_open_idx" ON "es_seo_audit_issues" USING btree ("resolved","ignored","severity");
