CREATE TABLE IF NOT EXISTS "es_brand_assets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" varchar(64) NOT NULL UNIQUE,
  "media_id" uuid REFERENCES "es_media_assets"("id"),
  "url" text NOT NULL,
  "original_url" text,
  "storage_key" text,
  "width" integer,
  "height" integer,
  "mime_type" varchar(128),
  "file_size" integer,
  "alt_text" text,
  "variants" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "version_hash" varchar(64),
  "updated_by" uuid REFERENCES "es_users"("id"),
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "es_brand_assets_key_idx" ON "es_brand_assets" ("key");

CREATE TABLE IF NOT EXISTS "es_brand_asset_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "asset_key" varchar(64) NOT NULL,
  "media_id" uuid,
  "previous_url" text,
  "new_url" text,
  "action" varchar(32) NOT NULL,
  "actor_id" uuid REFERENCES "es_users"("id"),
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "es_brand_asset_history_key_idx" ON "es_brand_asset_history" ("asset_key", "created_at");
