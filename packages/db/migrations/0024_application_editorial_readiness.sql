ALTER TABLE "es_jobs" ALTER COLUMN "application_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_whatsapp_original" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_whatsapp_message" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_whatsapp_valid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_whatsapp_validated_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_whatsapp_source" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_email_subject" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_email_instructions" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_email_valid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_email_validated_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_email_source" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_instructions" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_url_status" text DEFAULT 'UNCHECKED' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_url_http_status" integer;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_url_final_url" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_url_checked_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "application_url_check_reason" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "reviewed_by" uuid REFERENCES "es_users"("id");--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "reviewed_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "category_suggestion" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "category_suggestion_confidence" numeric;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "category_suggestion_reason" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "category_suggestion_source" text;--> statement-breakpoint
ALTER TABLE "es_jobs" ADD COLUMN IF NOT EXISTS "category_suggested_at" timestamptz;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "es_jobs" ADD CONSTRAINT "es_jobs_review_publication_ck"
    CHECK (NOT ("verification_status" = 'NEEDS_REVIEW' AND "publication_status" = 'PUBLISHED'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "es_content_pillars" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "description" text,
  "audience" text DEFAULT 'CANDIDATE' NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "es_content_clusters" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "pillar_id" uuid NOT NULL REFERENCES "es_content_pillars"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "description" text,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "es_content_clusters_pillar_slug_uq" ON "es_content_clusters" ("pillar_id", "slug");--> statement-breakpoint

ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "reviewer_id" uuid REFERENCES "es_users"("id");--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "pillar_id" uuid REFERENCES "es_content_pillars"("id");--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "cluster_id" uuid REFERENCES "es_content_clusters"("id");--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "primary_keyword" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "search_intent" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "sources" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "ai_assisted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "fact_checked_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "sponsored_content" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "sponsorship_disclosure" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "related_article_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "related_job_ids" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "internal_link_suggestions" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "editorial_stage" text DEFAULT 'PITCH' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "reviewed_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "fact_review_notes" text;--> statement-breakpoint

ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "warnings" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "suggestions" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "confidence" numeric;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "review_status" text DEFAULT 'NEEDS_REVIEW' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "approved_by" uuid REFERENCES "es_users"("id");--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "approved_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "changed_fields" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_import_rows" ADD COLUMN IF NOT EXISTS "application_channels" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint

INSERT INTO "es_content_pillars" ("name", "slug", "description", "audience") VALUES
  ('Vagas na Grande Ilha', 'vagas-grande-ilha', 'Oportunidades por cidade, setor e modalidade na Grande Ilha.', 'CANDIDATE'),
  ('Guia gratuito do candidato', 'guia-candidato', 'Orientação gratuita para procurar emprego com segurança.', 'CANDIDATE'),
  ('Setores que contratam no Maranhão', 'setores-maranhao', 'Conteúdo local sobre setores e profissões.', 'CANDIDATE'),
  ('Mercado de trabalho local', 'mercado-trabalho-local', 'Dados, calendário e tendências do mercado local.', 'CANDIDATE'),
  ('Conteúdo para empresas', 'conteudo-empresas', 'Recrutamento local, employer branding e divulgação de vagas.', 'COMPANY')
ON CONFLICT ("slug") DO NOTHING;--> statement-breakpoint

INSERT INTO "es_content_clusters" ("pillar_id", "name", "slug")
SELECT p.id, v.name, v.slug FROM "es_content_pillars" p JOIN (VALUES
  ('vagas-grande-ilha', 'Empregos em São Luís', 'empregos-sao-luis'),
  ('vagas-grande-ilha', 'Empregos em São José de Ribamar', 'empregos-sao-jose-de-ribamar'),
  ('vagas-grande-ilha', 'Empregos em Paço do Lumiar', 'empregos-paco-do-lumiar'),
  ('vagas-grande-ilha', 'Empregos em Raposa', 'empregos-raposa'),
  ('guia-candidato', 'Currículo', 'curriculo'),
  ('guia-candidato', 'Entrevista', 'entrevista'),
  ('guia-candidato', 'Primeiro emprego', 'primeiro-emprego'),
  ('guia-candidato', 'Jovem Aprendiz', 'jovem-aprendiz'),
  ('guia-candidato', 'Segurança contra golpes', 'seguranca-golpes'),
  ('setores-maranhao', 'Logística e porto', 'logistica-porto'),
  ('setores-maranhao', 'Saúde', 'saude'),
  ('setores-maranhao', 'Tecnologia', 'tecnologia'),
  ('mercado-trabalho-local', 'Análises mensais', 'analises-mensais'),
  ('mercado-trabalho-local', 'Salários e profissões', 'salarios-profissoes'),
  ('conteudo-empresas', 'Como publicar vaga', 'como-publicar-vaga'),
  ('conteudo-empresas', 'Recrutamento local', 'recrutamento-local')
) AS v(pillar_slug, name, slug) ON p.slug = v.pillar_slug
ON CONFLICT ("pillar_id", "slug") DO NOTHING;
