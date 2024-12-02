-- CreateTable
CREATE TABLE "Evaluation" (
    "id" UUID NOT NULL,
    "interviewId" UUID NOT NULL,
    "questionDetails" JSONB NOT NULL,
    "feedbackInterviewer" JSONB NOT NULL,
    "feedbackCandidate" JSONB NOT NULL,
    "relevancyAI" DOUBLE PRECISION,
    "relevancyCandidate" DOUBLE PRECISION,
    "idealAnswerAI" JSONB,
    "marksAI" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
