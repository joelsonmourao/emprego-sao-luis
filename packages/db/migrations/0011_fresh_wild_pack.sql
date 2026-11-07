CREATE TABLE "es_password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "es_password_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "es_sessions" ADD COLUMN "ip_hash" text;--> statement-breakpoint
ALTER TABLE "es_sessions" ADD COLUMN "user_agent_hash" text;--> statement-breakpoint
ALTER TABLE "es_password_reset_tokens" ADD CONSTRAINT "es_password_reset_tokens_user_id_es_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."es_users"("id") ON DELETE cascade ON UPDATE no action;