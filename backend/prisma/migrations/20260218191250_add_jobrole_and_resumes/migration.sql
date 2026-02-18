-- CreateEnum
CREATE TYPE "JobRole" AS ENUM ('FRONTEND_DEVELOPER', 'FRONTEND_ENGINEER', 'BACKEND_DEVELOPER', 'BACKEND_ENGINEER', 'MERN_STACK_DEVELOPER', 'FULL_STACK_DEVELOPER', 'SOFTWARE_ENGINEER', 'CMS_DEVELOPER');

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "jobRole" "JobRole" NOT NULL DEFAULT 'SOFTWARE_ENGINEER';

-- CreateTable
CREATE TABLE "resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobRole" "JobRole" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resume_userId_idx" ON "resume"("userId");

-- CreateIndex
CREATE INDEX "resume_jobRole_idx" ON "resume"("jobRole");

-- CreateIndex
CREATE UNIQUE INDEX "resume_userId_jobRole_key" ON "resume"("userId", "jobRole");

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
