ALTER TABLE "es_import_batches" DROP CONSTRAINT IF EXISTS "es_import_batches_file_hash_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "es_import_batches_file_hash_unique";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "es_import_batches_hash_idx" ON "es_import_batches" USING btree ("file_hash", "created_at");--> statement-breakpoint

ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "description_html" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "unidentified_company" boolean DEFAULT false NOT NULL;--> statement-breakpoint

UPDATE "es_jobs"
SET "description_html" = concat_ws(
  E'\n',
  CASE WHEN nullif(btrim("description"), '') IS NOT NULL THEN '<p>' || replace(replace(replace("description", '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</p>' END,
  CASE WHEN jsonb_array_length("activities") > 0 THEN '<h2>Atividades</h2><ul>' || (SELECT string_agg('<li>' || replace(replace(replace(value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</li>', '') FROM jsonb_array_elements_text("activities")) || '</ul>' END,
  CASE WHEN jsonb_array_length("requirements") > 0 THEN '<h2>Requisitos</h2><ul>' || (SELECT string_agg('<li>' || replace(replace(replace(value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</li>', '') FROM jsonb_array_elements_text("requirements")) || '</ul>' END,
  CASE WHEN jsonb_array_length("benefits") > 0 THEN '<h2>Benefícios</h2><ul>' || (SELECT string_agg('<li>' || replace(replace(replace(value, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</li>', '') FROM jsonb_array_elements_text("benefits")) || '</ul>' END,
  CASE WHEN nullif(btrim("additional_info"), '') IS NOT NULL THEN '<h2>Informações adicionais</h2><p>' || replace(replace(replace("additional_info", '&', '&amp;'), '<', '&lt;'), '>', '&gt;') || '</p>' END
)
WHERE "description_html" IS NULL;--> statement-breakpoint
UPDATE "es_jobs" SET "description_html" = '<p>Descrição da vaga não informada.</p>' WHERE nullif(btrim("description_html"), '') IS NULL;--> statement-breakpoint
ALTER TABLE "es_jobs" ALTER COLUMN "description_html" SET NOT NULL;--> statement-breakpoint

INSERT INTO "es_companies" (
  "id", "name", "public_name", "normalized_name", "slug", "active", "created_at", "updated_at"
) VALUES (
  '00000000-0000-4000-8000-000000000001',
  'Contratante não identificada na fonte',
  NULL,
  'contratante nao identificada na fonte',
  'contratante-nao-identificada',
  false,
  now(),
  now()
)
ON CONFLICT ("id") DO NOTHING;
