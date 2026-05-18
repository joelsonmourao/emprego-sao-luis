-- CreateEnum
CREATE TYPE "LocationMatchStatus" AS ENUM ('MATCHED', 'LOW_CONFIDENCE', 'NOT_FOUND', 'API_ERROR');

-- CreateTable
CREATE TABLE "LocationEnrichmentCache" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyNameNormalized" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "provider" TEXT NOT NULL,
    "providerPlaceId" TEXT,
    "streetAddress" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "matchStatus" "LocationMatchStatus" NOT NULL,
    "matchConfidence" DOUBLE PRECISION,
    "rawQuery" TEXT,
    "lastFetchedAt" TIMESTAMP(3),
    "lastValidatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocationEnrichmentCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationEnrichmentCache_companyNameNormalized_city_state_key" ON "LocationEnrichmentCache"("companyNameNormalized", "city", "state");

-- CreateIndex
CREATE INDEX "LocationEnrichmentCache_matchStatus_idx" ON "LocationEnrichmentCache"("matchStatus");
