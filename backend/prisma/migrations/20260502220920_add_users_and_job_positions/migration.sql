-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'dealer', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "companyname" TEXT,
    "telephone" TEXT,
    "address" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPosition" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "locationType" TEXT NOT NULL DEFAULT 'Ofis içi',
    "employmentType" TEXT NOT NULL DEFAULT 'Tam zamanlı',
    "summary" TEXT NOT NULL,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicationEmail" TEXT NOT NULL DEFAULT 'info@tum-ex.com',
    "applicationSubject" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "JobPosition_title_idx" ON "JobPosition"("title");

-- CreateIndex
CREATE INDEX "JobPosition_department_idx" ON "JobPosition"("department");

-- CreateIndex
CREATE INDEX "JobPosition_sortOrder_idx" ON "JobPosition"("sortOrder");

-- CreateIndex
CREATE INDEX "JobPosition_isPublished_idx" ON "JobPosition"("isPublished");
