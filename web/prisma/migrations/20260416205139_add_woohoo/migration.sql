-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('reddit');

-- CreateEnum
CREATE TYPE "TimelineItemType" AS ENUM ('dm', 'comment');

-- CreateTable
CREATE TABLE "woohoo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "peerId" TEXT NOT NULL,
    "peerName" TEXT,
    "chatUrl" TEXT,
    "followUpAt" TIMESTAMP(3),
    "lastInteractionAt" TIMESTAMP(3),
    "lastSavedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "woohoo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_item" (
    "id" TEXT NOT NULL,
    "woohooId" TEXT NOT NULL,
    "type" "TimelineItemType" NOT NULL DEFAULT 'dm',
    "externalId" TEXT,
    "contentText" TEXT NOT NULL,
    "contentHtml" TEXT,
    "sourceUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT,
    "interactionAt" TIMESTAMP(3) NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "woohoo_userId_platform_peerId_key" ON "woohoo"("userId", "platform", "peerId");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_item_woohooId_externalId_key" ON "timeline_item"("woohooId", "externalId");

-- AddForeignKey
ALTER TABLE "woohoo" ADD CONSTRAINT "woohoo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_item" ADD CONSTRAINT "timeline_item_woohooId_fkey" FOREIGN KEY ("woohooId") REFERENCES "woohoo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
