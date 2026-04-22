-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emailDigestEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "digest_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "localDate" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digest_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "digest_log_userId_idx" ON "digest_log"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "digest_log_userId_localDate_key" ON "digest_log"("userId", "localDate");

-- AddForeignKey
ALTER TABLE "digest_log" ADD CONSTRAINT "digest_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
