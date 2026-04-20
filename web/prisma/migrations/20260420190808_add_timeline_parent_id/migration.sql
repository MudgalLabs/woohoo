-- AlterTable
ALTER TABLE "timeline_item" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "timeline_item_woohooId_parentId_idx" ON "timeline_item"("woohooId", "parentId");

-- AddForeignKey
ALTER TABLE "timeline_item" ADD CONSTRAINT "timeline_item_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "timeline_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
