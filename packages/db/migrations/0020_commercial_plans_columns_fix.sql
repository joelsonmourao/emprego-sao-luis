-- Corrige colunas ausentes em es_commercial_plans quando 0018 foi marcada sem aplicar o DDL completo.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'short_description'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "short_description" text DEFAULT '' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'full_description_html'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "full_description_html" text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'currency'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "currency" varchar(3) DEFAULT 'BRL' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'posts_count'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "posts_count" integer DEFAULT 0 NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'billing_type'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "billing_type" text DEFAULT 'one_time' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'promo_starts_at'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "promo_starts_at" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'promo_ends_at'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "promo_ends_at" timestamp with time zone;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'setup_required'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "setup_required" boolean DEFAULT true NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'es_commercial_plans' AND column_name = 'archived'
  ) THEN
    ALTER TABLE "es_commercial_plans" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ALTER COLUMN "active" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "es_commercial_plans" ALTER COLUMN "price" SET DEFAULT '0';
