-- CreateTable
CREATE TABLE "top_company" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "webLink" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "top_company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "top_company_userId_idx" ON "top_company"("userId");

-- AddForeignKey
ALTER TABLE "top_company" ADD CONSTRAINT "top_company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
