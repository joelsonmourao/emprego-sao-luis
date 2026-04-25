-- CreateEnum
CREATE TYPE "ImportQueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ImportQueue" (
    "id" TEXT NOT NULL,
    "status" "ImportQueueStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "importedCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "result" JSONB,
    "errorMessage" TEXT,
    "createdById" TEXT,
    "createdByName" TEXT,
    "createdByEmail" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImportQueue_status_createdAt_idx" ON "ImportQueue"("status", "createdAt" DESC);
