-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('free', 'pro');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- CreateTable
CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "tier" "PlanTier" NOT NULL,
    "name" TEXT NOT NULL,
    "activeWoohooLimit" INTEGER,
    "priceCents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plan_tier_key" ON "plan"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");

-- CreateIndex
CREATE INDEX "subscription_planId_idx" ON "subscription"("planId");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed built-in plans. Fixed ids so every environment resolves the same rows.
INSERT INTO "plan" ("id", "tier", "name", "activeWoohooLimit", "priceCents", "createdAt", "updatedAt")
VALUES
  ('plan_free', 'free', 'Free', 100, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('plan_pro',  'pro',  'Pro',  NULL, 500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("tier") DO NOTHING;

-- Backfill a Free subscription for every existing user who doesn't have one.
-- id uses md5(userId) so it's deterministic and safe to re-run.
INSERT INTO "subscription" ("id", "userId", "planId", "status", "startedAt", "createdAt", "updatedAt")
SELECT 'sub_' || md5(u."id"), u."id", 'plan_free', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "user" u
LEFT JOIN "subscription" s ON s."userId" = u."id"
WHERE s."id" IS NULL;
