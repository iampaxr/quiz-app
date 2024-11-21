/*
  Warnings:

  - You are about to drop the `_MultipleAnswers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SingleAnswers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MultipleAnswers" DROP CONSTRAINT "_MultipleAnswers_A_fkey";

-- DropForeignKey
ALTER TABLE "_MultipleAnswers" DROP CONSTRAINT "_MultipleAnswers_B_fkey";

-- DropForeignKey
ALTER TABLE "_SingleAnswers" DROP CONSTRAINT "_SingleAnswers_A_fkey";

-- DropForeignKey
ALTER TABLE "_SingleAnswers" DROP CONSTRAINT "_SingleAnswers_B_fkey";

-- DropTable
DROP TABLE "_MultipleAnswers";

-- DropTable
DROP TABLE "_SingleAnswers";

-- CreateTable
CREATE TABLE "_QuestionToUserTestDetail" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToUserTestDetail_AB_unique" ON "_QuestionToUserTestDetail"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToUserTestDetail_B_index" ON "_QuestionToUserTestDetail"("B");

-- AddForeignKey
ALTER TABLE "_QuestionToUserTestDetail" ADD CONSTRAINT "_QuestionToUserTestDetail_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToUserTestDetail" ADD CONSTRAINT "_QuestionToUserTestDetail_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
