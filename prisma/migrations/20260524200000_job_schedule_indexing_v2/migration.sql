DO $$
BEGIN
  CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'EXPIRED', 'ERROR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "JobIndexingStatus" AS ENUM ('NOT_SENT', 'QUEUED', 'SENT', 'ERROR', 'SKIPPED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "JobScheduleSource" AS ENUM ('PLANILHA', 'ADMIN', 'AUTOMATICO', 'MANUAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Job"
  ALTER COLUMN "publishedAt" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "autoSubmitToIndexing" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "indexingStatus" "JobIndexingStatus" NOT NULL DEFAULT 'NOT_SENT',
  ADD COLUMN IF NOT EXISTS "indexingLastSubmittedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "indexingError" TEXT,
  ADD COLUMN IF NOT EXISTS "scheduleSource" "JobScheduleSource",
  ADD COLUMN IF NOT EXISTS "scheduledImportRawValue" TEXT,
  ADD COLUMN IF NOT EXISTS "importError" TEXT;

UPDATE "Job"
SET
  "scheduledAt" = COALESCE("scheduledAt", "scheduledPublishAt"),
  "status" = CASE
    WHEN "publicationStatus" IN ('AGUARDANDO_AGENDAMENTO', 'AGENDADA') OR "scheduledPublishAt" IS NOT NULL THEN 'SCHEDULED'::"JobStatus"
    WHEN "isActive" = true THEN 'PUBLISHED'::"JobStatus"
    ELSE 'DRAFT'::"JobStatus"
  END,
  "scheduleSource" = CASE
    WHEN "scheduleSource" IS NOT NULL THEN "scheduleSource"
    WHEN "scheduledPublishAt" IS NOT NULL THEN 'PLANILHA'::"JobScheduleSource"
    ELSE NULL
  END,
  "indexingStatus" = CASE
    WHEN UPPER(COALESCE("googleIndexingStatus", '')) IN ('OK', 'SENT', 'SUCCESS') THEN 'SENT'::"JobIndexingStatus"
    WHEN UPPER(COALESCE("googleIndexingStatus", '')) IN ('INDEXANDO_GOOGLE', 'QUEUED', 'PENDING') THEN 'QUEUED'::"JobIndexingStatus"
    WHEN UPPER(COALESCE("googleIndexingStatus", '')) IN ('ERRO', 'ERROR', 'FAILED') THEN 'ERROR'::"JobIndexingStatus"
    ELSE "indexingStatus"
  END,
  "indexingLastSubmittedAt" = COALESCE("indexingLastSubmittedAt", "googleIndexedAt"),
  "indexingError" = CASE
    WHEN "indexingError" IS NOT NULL THEN "indexingError"
    WHEN UPPER(COALESCE("googleIndexingStatus", '')) IN ('ERRO', 'ERROR', 'FAILED') THEN COALESCE(NULLIF("googleIndexingMessage", ''), 'Falha no envio para indexacao (legado).')
    ELSE "indexingError"
  END;

CREATE TABLE IF NOT EXISTS "IndexingLog" (
  "id" TEXT NOT NULL,
  "jobId" TEXT,
  "url" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "httpStatus" INTEGER,
  "response" JSONB,
  "error" TEXT,
  "attempts" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IndexingLog_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  ALTER TABLE "IndexingLog"
    ADD CONSTRAINT "IndexingLog_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "Job"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Job_status_scheduledAt_idx" ON "Job"("status", "scheduledAt");
CREATE INDEX IF NOT EXISTS "Job_status_isActive_publishedAt_idx" ON "Job"("status", "isActive", "publishedAt" DESC);
CREATE INDEX IF NOT EXISTS "Job_indexingStatus_indexingLastSubmittedAt_idx" ON "Job"("indexingStatus", "indexingLastSubmittedAt");
CREATE INDEX IF NOT EXISTS "IndexingLog_jobId_createdAt_idx" ON "IndexingLog"("jobId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "IndexingLog_status_createdAt_idx" ON "IndexingLog"("status", "createdAt" DESC);
