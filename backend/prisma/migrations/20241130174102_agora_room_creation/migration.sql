/*
  Warnings:

  - You are about to drop the column `usePredefined` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AskedQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[appId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_askedQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "AskedQuestion" DROP CONSTRAINT "AskedQuestion_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "AskedQuestion" DROP CONSTRAINT "AskedQuestion_questionId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "usePredefined";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "token",
ADD COLUMN     "inUse" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "AskedQuestion";

-- DropTable
DROP TABLE "Question";

-- CreateIndex
CREATE UNIQUE INDEX "Room_appId_key" ON "Room"("appId");
