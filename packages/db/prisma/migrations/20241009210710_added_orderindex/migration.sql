/*
  Warnings:

  - Added the required column `order` to the `UserTestDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTestDetail" ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "testType" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "UserTestDetail_order_idx" ON "UserTestDetail"("order");
