/*
  Warnings:

  - You are about to drop the `TestQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TestQuestionToUserTestDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TestQuestionToUserTestDetail" DROP CONSTRAINT "_TestQuestionToUserTestDetail_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestQuestionToUserTestDetail" DROP CONSTRAINT "_TestQuestionToUserTestDetail_B_fkey";

-- DropTable
DROP TABLE "TestQuestion";

-- DropTable
DROP TABLE "_TestQuestionToUserTestDetail";

-- CreateTable
CREATE TABLE "_UserTestQuestions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserTestQuestions_AB_unique" ON "_UserTestQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_UserTestQuestions_B_index" ON "_UserTestQuestions"("B");

-- AddForeignKey
ALTER TABLE "_UserTestQuestions" ADD CONSTRAINT "_UserTestQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTestQuestions" ADD CONSTRAINT "_UserTestQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
