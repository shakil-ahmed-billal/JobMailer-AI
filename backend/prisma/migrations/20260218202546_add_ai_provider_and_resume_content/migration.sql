-- CreateEnum
CREATE TYPE "AIProvider" AS ENUM ('OPENAI', 'GEMINI');

-- AlterTable
ALTER TABLE "email" ADD COLUMN     "aiProvider" "AIProvider" NOT NULL DEFAULT 'OPENAI';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "portfolioLink" TEXT,
ADD COLUMN     "resumeContent" TEXT,
ADD COLUMN     "skills" TEXT;

-- CreateIndex
CREATE INDEX "email_aiProvider_idx" ON "email"("aiProvider");
