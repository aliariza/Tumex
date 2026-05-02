-- CreateEnum
CREATE TYPE "MachineCategory" AS ENUM ('abkant', 'laser_cutting', 'laser_welding');

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "category" "MachineCategory" NOT NULL,
    "brand" TEXT,
    "family" TEXT,
    "series" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "image" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pressForceTon" DOUBLE PRECISION,
    "bendingLengthMm" DOUBLE PRECISION,
    "powerKw" DOUBLE PRECISION,
    "workingAreaCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineSpec" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MachineSpec_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_category_series_model_key" ON "Machine"("category", "series", "model");

-- AddForeignKey
ALTER TABLE "MachineSpec" ADD CONSTRAINT "MachineSpec_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
