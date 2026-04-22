-- CreateTable
CREATE TABLE "AdSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "globalEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSlot" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" VARCHAR(48) NOT NULL,
    "pageKey" VARCHAR(48) NOT NULL DEFAULT 'global',
    "previewPath" VARCHAR(512) NOT NULL DEFAULT '/',
    "code" TEXT NOT NULL DEFAULT '',
    "adsenseSlotId" VARCHAR(32),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxPerPage" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdSlot_slug_key" ON "AdSlot"("slug");

-- CreateIndex
CREATE INDEX "AdSlot_pageKey_isActive_idx" ON "AdSlot"("pageKey", "isActive");

-- CreateIndex
CREATE INDEX "AdSlot_sortOrder_idx" ON "AdSlot"("sortOrder");

INSERT INTO "AdSettings" ("id", "globalEnabled", "updatedAt")
VALUES ('singleton', true, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "AdSlot" ("id", "slug", "name", "position", "pageKey", "previewPath", "code", "adsenseSlotId", "isActive", "maxPerPage", "notes", "sortOrder", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'home-after-quicklinks', 'Home — apos atalhos', 'top', 'home', '/', '', '1234567890', false, 1, 'Desativado por padrao para manter ate 3 anuncios ativos na home.', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'home-featured-mid', 'Home — entre destaque e CTA', 'between-listings', 'home', '/', '', '2345678901', true, 1, 'Listagem de vagas em destaque.', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'home-blog', 'Home — secao blog', 'footer', 'home', '/#blog', '', '3456789012', true, 1, 'Rodape da area de blog na home.', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'home-faq', 'Home — FAQ', 'footer', 'home', '/#faq', '', '4567890123', true, 1, 'Antes do bloco final.', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'vagas-grid-mid', 'Listagem de vagas — entre cards', 'between-listings', 'jobs-list', '/vagas', '', '7890123456', true, 1, 'Exibido apos o 6o card quando ha vagas suficientes.', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'job-after-hero', 'Vaga — apos faixa do titulo', 'top', 'job-detail', '/vagas', '', '1111111111', true, 1, 'Entre H1/conteudo e descricao.', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'job-after-description', 'Vaga — apos descricao', 'between-listings', 'job-detail', '/vagas', '', '2222222222', true, 1, 'Antes do bloco de requisitos.', 70, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'job-sidebar', 'Vaga — sidebar', 'sidebar', 'job-detail', '/vagas', '', '6789012345', true, 1, 'Coluna lateral acima das relacionadas.', 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
