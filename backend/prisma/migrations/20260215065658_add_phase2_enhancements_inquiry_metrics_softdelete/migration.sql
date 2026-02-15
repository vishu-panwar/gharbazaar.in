-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT;

-- CreateTable
CREATE TABLE "PropertyInquiry" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "buyerId" TEXT,
    "sellerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "inquiryType" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'new',
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "leadScore" INTEGER DEFAULT 0,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "source" TEXT DEFAULT 'website',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerMetrics" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "leadsGenerated" INTEGER NOT NULL DEFAULT 0,
    "leadsConverted" INTEGER NOT NULL DEFAULT 0,
    "propertiesListed" INTEGER NOT NULL DEFAULT 0,
    "propertiesSold" INTEGER NOT NULL DEFAULT 0,
    "totalCommission" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "averageLeadScore" DECIMAL(5,2),
    "customerSatisfaction" DECIMAL(3,2),
    "responseTime" INTEGER,
    "tier" TEXT DEFAULT 'bronze',
    "metadata" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PropertyInquiry_propertyId_idx" ON "PropertyInquiry"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyInquiry_buyerId_idx" ON "PropertyInquiry"("buyerId");

-- CreateIndex
CREATE INDEX "PropertyInquiry_sellerId_idx" ON "PropertyInquiry"("sellerId");

-- CreateIndex
CREATE INDEX "PropertyInquiry_status_idx" ON "PropertyInquiry"("status");

-- CreateIndex
CREATE INDEX "PropertyInquiry_createdAt_idx" ON "PropertyInquiry"("createdAt");

-- CreateIndex
CREATE INDEX "PartnerMetrics_partnerId_idx" ON "PartnerMetrics"("partnerId");

-- CreateIndex
CREATE INDEX "PartnerMetrics_year_month_idx" ON "PartnerMetrics"("year", "month");

-- CreateIndex
CREATE INDEX "PartnerMetrics_tier_idx" ON "PartnerMetrics"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerMetrics_partnerId_month_year_key" ON "PartnerMetrics"("partnerId", "month", "year");

-- CreateIndex
CREATE INDEX "Contract_deletedAt_idx" ON "Contract"("deletedAt");

-- CreateIndex
CREATE INDEX "Property_featured_idx" ON "Property"("featured");

-- CreateIndex
CREATE INDEX "Property_deletedAt_idx" ON "Property"("deletedAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- AddForeignKey
ALTER TABLE "PropertyInquiry" ADD CONSTRAINT "PropertyInquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInquiry" ADD CONSTRAINT "PropertyInquiry_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyInquiry" ADD CONSTRAINT "PropertyInquiry_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerMetrics" ADD CONSTRAINT "PartnerMetrics_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
