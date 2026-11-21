CREATE TABLE "es_login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_hash" text NOT NULL,
	"ip_hash" text NOT NULL,
	"successful" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "es_login_attempts_rate_idx" ON "es_login_attempts" USING btree ("email_hash","ip_hash","created_at");