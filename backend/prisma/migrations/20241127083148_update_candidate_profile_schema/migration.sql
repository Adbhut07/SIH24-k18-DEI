/*
  Warnings:

  - The `experience` column on the `CandidateProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `education` column on the `CandidateProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CandidateProfile" ALTER COLUMN "gateScore" SET DATA TYPE TEXT,
ALTER COLUMN "jeeScore" SET DATA TYPE TEXT,
DROP COLUMN "experience",
ADD COLUMN     "experience" JSONB,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB;
