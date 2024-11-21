/*
  Warnings:

  - You are about to drop the column `order` on the `UserTestDetail` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UserTestDetail_order_idx";

-- AlterTable
ALTER TABLE "UserTestDetail" DROP COLUMN "order";
