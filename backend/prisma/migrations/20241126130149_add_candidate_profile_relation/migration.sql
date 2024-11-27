-- CreateTable
CREATE TABLE "CandidateProfile" (
    "id" UUID NOT NULL,
    "candidateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "age" INTEGER,
    "location" TEXT,
    "aadharNumber" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "summary" TEXT,
    "resume" TEXT,
    "medicalReport" TEXT,
    "tenthMarks" TEXT,
    "twelfthMarks" TEXT,
    "gateScore" DOUBLE PRECISION,
    "jeeScore" DOUBLE PRECISION,
    "experience" TEXT,
    "education" TEXT,
    "skills" TEXT[],
    "achievements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_candidateId_key" ON "CandidateProfile"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_aadharNumber_key" ON "CandidateProfile"("aadharNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_email_key" ON "CandidateProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateProfile_phoneNumber_key" ON "CandidateProfile"("phoneNumber");

-- AddForeignKey
ALTER TABLE "CandidateProfile" ADD CONSTRAINT "CandidateProfile_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
