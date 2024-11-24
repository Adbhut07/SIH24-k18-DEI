/*
  Warnings:

  - You are about to drop the column `roundId` on the `AskedQuestion` table. All the data in the column will be lost.
  - You are about to drop the `Round` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roomId]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `interviewId` to the `AskedQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AskedQuestion" DROP CONSTRAINT "AskedQuestion_roundId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_interviewerId_fkey";

-- AlterTable
ALTER TABLE "AskedQuestion" DROP COLUMN "roundId",
ADD COLUMN     "interviewId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "roomId" TEXT;

-- DropTable
DROP TABLE "Round";

-- CreateIndex
CREATE UNIQUE INDEX "Interview_roomId_key" ON "Interview"("roomId");

-- AddForeignKey
ALTER TABLE "AskedQuestion" ADD CONSTRAINT "AskedQuestion_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
