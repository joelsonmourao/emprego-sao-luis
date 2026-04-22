-- CreateEnum
CREATE TYPE "JobPublicationStatus" AS ENUM ('AGUARDANDO_AGENDAMENTO', 'AGENDADA', 'PUBLICANDO', 'PUBLICADA', 'INDEXANDO_GOOGLE', 'OK', 'ERRO');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "scheduledPublishAt" TIMESTAMP(3),
ADD COLUMN     "publicationStatus" "JobPublicationStatus" NOT NULL DEFAULT 'OK',
ADD COLUMN     "googleIndexingStatus" VARCHAR(64),
ADD COLUMN     "googleIndexingMessage" TEXT,
ADD COLUMN     "googleIndexedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Job_publicationStatus_scheduledPublishAt_idx" ON "Job"("publicationStatus", "scheduledPublishAt");
