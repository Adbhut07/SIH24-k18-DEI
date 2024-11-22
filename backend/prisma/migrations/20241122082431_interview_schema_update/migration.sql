/*
  Warnings:

  - The values [AI_DRIVEN] on the enum `InterviewType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `interviewerId` on the `Interview` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewType_new" AS ENUM ('HUMAN_LED');
ALTER TABLE "Interview" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Interview" ALTER COLUMN "type" TYPE "InterviewType_new" USING ("type"::text::"InterviewType_new");
ALTER TYPE "InterviewType" RENAME TO "InterviewType_old";
ALTER TYPE "InterviewType_new" RENAME TO "InterviewType";
DROP TYPE "InterviewType_old";
ALTER TABLE "Interview" ALTER COLUMN "type" SET DEFAULT 'HUMAN_LED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_interviewerId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "interviewerId",
ALTER COLUMN "type" SET DEFAULT 'HUMAN_LED';

-- CreateTable
CREATE TABLE "InterviewInterviewer" (
    "id" UUID NOT NULL,
    "interviewId" UUID NOT NULL,
    "interviewerId" UUID NOT NULL,

    CONSTRAINT "InterviewInterviewer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewInterviewer" ADD CONSTRAINT "InterviewInterviewer_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewInterviewer" ADD CONSTRAINT "InterviewInterviewer_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
