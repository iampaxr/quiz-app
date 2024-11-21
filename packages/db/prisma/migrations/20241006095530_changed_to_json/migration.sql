/*
  Warnings:

  - The `userAnswers` column on the `UserTestDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserTestDetail" DROP COLUMN "userAnswers",
ADD COLUMN     "userAnswers" JSONB;
