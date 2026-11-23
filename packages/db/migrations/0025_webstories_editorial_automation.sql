ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "editorial_template" text DEFAULT 'STANDARD' NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "direct_answer" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "local_hook" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "audience" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "faq_json" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "candidate_cta" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "company_cta" text;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "discover_eligible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "news_eligible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "web_story_eligible" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "editorial_score" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "review_due_at" timestamptz;--> statement-breakpoint
ALTER TABLE "es_articles" ADD COLUMN IF NOT EXISTS "alternative_titles" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "es_classification_rules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_slug" text NOT NULL,
  "category_name" text NOT NULL,
  "keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "synonyms" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "priority" integer DEFAULT 100 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "es_classification_rules_slug_uq" ON "es_classification_rules" ("category_slug");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "es_web_stories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "article_id" uuid REFERENCES "es_articles"("id"),
  "author_id" uuid REFERENCES "es_authors"("id"),
  "reviewer_id" uuid REFERENCES "es_users"("id"),
  "status" "es_publication_status" DEFAULT 'DRAFT' NOT NULL,
  "pages" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "poster_url" text,
  "poster_alt" text,
  "canonical_url" text,
  "seo_title" text,
  "meta_description" text,
  "cta_label" text,
  "cta_url" text,
  "eligibility_notes" text,
  "rejection_reason" text,
  "published_at" timestamptz,
  "scheduled_at" timestamptz,
  "expires_at" timestamptz,
  "reviewed_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "es_web_stories_status_idx" ON "es_web_stories" ("status", "published_at");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "es_job_application_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "job_id" uuid NOT NULL REFERENCES "es_jobs"("id") ON DELETE CASCADE,
  "channel" text NOT NULL,
  "action" text NOT NULL,
  "placement" text,
  "user_agent" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "es_job_application_events_job_idx" ON "es_job_application_events" ("job_id", "created_at");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "es_adsense_readiness_history" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "classification" text NOT NULL,
  "stage_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "generated_at" timestamptz DEFAULT now() NOT NULL,
  "actor_id" uuid REFERENCES "es_users"("id"),
  "created_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint

INSERT INTO "es_content_pillars" ("name", "slug", "description", "audience") VALUES
  ('Fontes, confiança e segurança', 'fontes-confianca-seguranca', 'Transparência editorial, verificação de vagas, denúncias e segurança do candidato.', 'CANDIDATE')
ON CONFLICT ("slug") DO NOTHING;--> statement-breakpoint

UPDATE "es_content_pillars"
SET "name" = 'Empresas e recrutamento local',
    "description" = 'Como publicar vaga, contratar, employer branding e divulgação patrocinada na Grande Ilha.'
WHERE "slug" = 'conteudo-empresas';--> statement-breakpoint

INSERT INTO "es_content_clusters" ("pillar_id", "name", "slug")
SELECT p.id, v.name, v.slug FROM "es_content_pillars" p JOIN (VALUES
  ('vagas-grande-ilha', 'Vagas em São Luís', 'vagas-sao-luis'),
  ('vagas-grande-ilha', 'Vagas em Raposa', 'vagas-raposa'),
  ('vagas-grande-ilha', 'Vagas em Paço do Lumiar', 'vagas-paco-do-lumiar'),
  ('vagas-grande-ilha', 'Vagas em São José de Ribamar', 'vagas-sao-jose-de-ribamar'),
  ('vagas-grande-ilha', 'Vagas por bairro', 'vagas-por-bairro'),
  ('vagas-grande-ilha', 'Vagas presenciais', 'vagas-presenciais'),
  ('vagas-grande-ilha', 'Vagas híbridas', 'vagas-hibridas'),
  ('vagas-grande-ilha', 'Vagas remotas', 'vagas-remotas'),
  ('vagas-grande-ilha', 'Vagas por nível', 'vagas-por-nivel'),
  ('vagas-grande-ilha', 'Vagas por setor', 'vagas-por-setor'),
  ('guia-candidato', 'Candidatura por e-mail', 'candidatura-email'),
  ('guia-candidato', 'Candidatura por WhatsApp', 'candidatura-whatsapp'),
  ('guia-candidato', 'Salário e benefícios', 'salario-beneficios'),
  ('guia-candidato', 'Direitos', 'direitos'),
  ('guia-candidato', 'Organização da busca', 'organizacao-busca'),
  ('guia-candidato', 'Qualificação gratuita', 'qualificacao-gratuita'),
  ('setores-maranhao', 'Comércio', 'comercio'),
  ('setores-maranhao', 'Indústria', 'industria'),
  ('setores-maranhao', 'Construção', 'construcao'),
  ('setores-maranhao', 'Serviços', 'servicos'),
  ('setores-maranhao', 'Atendimento', 'atendimento'),
  ('setores-maranhao', 'Hotelaria', 'hotelaria'),
  ('setores-maranhao', 'Alimentação', 'alimentacao'),
  ('setores-maranhao', 'Administrativo', 'administrativo'),
  ('mercado-trabalho-local', 'Relatório mensal', 'relatorio-mensal'),
  ('mercado-trabalho-local', 'Empresas contratando', 'empresas-contratando'),
  ('mercado-trabalho-local', 'Calendário de contratação', 'calendario-contratacao'),
  ('mercado-trabalho-local', 'Sazonalidade', 'sazonalidade'),
  ('mercado-trabalho-local', 'Tendências', 'tendencias'),
  ('mercado-trabalho-local', 'Concursos e seletivos', 'concursos-seletivos'),
  ('mercado-trabalho-local', 'Dados da Grande Ilha', 'dados-grande-ilha'),
  ('mercado-trabalho-local', 'Dados do Maranhão', 'dados-maranhao'),
  ('conteudo-empresas', 'Como contratar', 'como-contratar'),
  ('conteudo-empresas', 'Employer branding', 'employer-branding'),
  ('conteudo-empresas', 'Perfil empresarial', 'perfil-empresarial'),
  ('conteudo-empresas', 'Divulgação patrocinada', 'divulgacao-patrocinada'),
  ('conteudo-empresas', 'Métricas de divulgação', 'metricas-divulgacao'),
  ('conteudo-empresas', 'Boas práticas de contratação', 'boas-praticas-contratacao'),
  ('fontes-confianca-seguranca', 'Como as vagas são verificadas', 'como-vagas-verificadas'),
  ('fontes-confianca-seguranca', 'Política de fontes', 'politica-de-fontes'),
  ('fontes-confianca-seguranca', 'Política editorial', 'politica-editorial-cluster'),
  ('fontes-confianca-seguranca', 'Política de correções', 'politica-de-correcoes'),
  ('fontes-confianca-seguranca', 'Vagas encerradas', 'vagas-encerradas'),
  ('fontes-confianca-seguranca', 'Denúncias', 'denuncias'),
  ('fontes-confianca-seguranca', 'Golpes', 'golpes'),
  ('fontes-confianca-seguranca', 'Privacidade', 'privacidade-cluster'),
  ('fontes-confianca-seguranca', 'Transparência', 'transparencia'),
  ('fontes-confianca-seguranca', 'Publicidade patrocinada', 'publicidade-patrocinada')
) AS v(pillar_slug, name, slug) ON p.slug = v.pillar_slug
ON CONFLICT ("pillar_id", "slug") DO NOTHING;--> statement-breakpoint

INSERT INTO "es_classification_rules" ("category_slug", "category_name", "keywords", "synonyms", "priority") VALUES
  ('tecnologia', 'Tecnologia', '["desenvolvedor","programador","software","suporte ti","dados","tecnologia","infraestrutura"]'::jsonb, '["ti","dev","analista de sistemas"]'::jsonb, 10),
  ('saude', 'Saúde', '["enferm","médic","farmácia","hospital","clínica","odont","saúde"]'::jsonb, '["enfermeiro","farmacêutico"]'::jsonb, 20),
  ('comercio', 'Comércio', '["vendedor","vendas","loja","caixa","promotor","comercial"]'::jsonb, '["varejo"]'::jsonb, 30),
  ('logistica', 'Logística', '["logística","estoque","inventário","almoxarif","motorista","porto","armazém"]'::jsonb, '["transporte"]'::jsonb, 40),
  ('administrativo', 'Administrativo', '["administrativ","financeir","contábil","faturamento","assistente","analista"]'::jsonb, '["escritório"]'::jsonb, 50)
ON CONFLICT ("category_slug") DO NOTHING;
