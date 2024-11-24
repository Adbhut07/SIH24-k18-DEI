/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Round` will be added. If there are existing duplicate values, this will fail.
  - Made the column `roomId` on table `Round` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Round" ALTER COLUMN "roomId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Round_roomId_key" ON "Round"("roomId");
