/*
  Warnings:

  - Added the required column `categoryId` to the `SimulationTestDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SimulationTestDetail" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SimulationTestDetail" ADD CONSTRAINT "SimulationTestDetail_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
