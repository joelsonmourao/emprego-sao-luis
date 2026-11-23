ALTER TABLE "es_users" ADD COLUMN "mfa_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_users" ADD COLUMN "mfa_secret_encrypted" text;--> statement-breakpoint
ALTER TABLE "es_users" ADD COLUMN "mfa_pending_secret_encrypted" text;--> statement-breakpoint
ALTER TABLE "es_users" ADD COLUMN "recovery_code_hashes" jsonb DEFAULT '[]'::jsonb NOT NULL;