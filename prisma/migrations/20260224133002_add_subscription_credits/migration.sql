-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "creditsRemaining" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionPlan" "SubscriptionPlan";
