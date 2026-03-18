-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "UserModel" (
    "id" TEXT NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT,
    "lyrics" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seed" BIGINT,
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MusicGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "durationSec" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_firebaseUid_key" ON "UserModel"("firebaseUid");

-- CreateIndex
CREATE INDEX "UserModel_firebaseUid_idx" ON "UserModel"("firebaseUid");

-- CreateIndex
CREATE INDEX "MusicGeneration_userId_idx" ON "MusicGeneration"("userId");

-- CreateIndex
CREATE INDEX "MusicGeneration_status_idx" ON "MusicGeneration"("status");

-- AddForeignKey
ALTER TABLE "MusicGeneration" ADD CONSTRAINT "MusicGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "MusicGeneration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
