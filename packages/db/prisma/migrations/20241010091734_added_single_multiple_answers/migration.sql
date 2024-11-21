/*
  Warnings:

  - You are about to drop the `_UserTestQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserTestQuestions" DROP CONSTRAINT "_UserTestQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTestQuestions" DROP CONSTRAINT "_UserTestQuestions_B_fkey";

-- DropTable
DROP TABLE "_UserTestQuestions";

-- CreateTable
CREATE TABLE "_SingleAnswers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MultipleAnswers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SingleAnswers_AB_unique" ON "_SingleAnswers"("A", "B");

-- CreateIndex
CREATE INDEX "_SingleAnswers_B_index" ON "_SingleAnswers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MultipleAnswers_AB_unique" ON "_MultipleAnswers"("A", "B");

-- CreateIndex
CREATE INDEX "_MultipleAnswers_B_index" ON "_MultipleAnswers"("B");

-- AddForeignKey
ALTER TABLE "_SingleAnswers" ADD CONSTRAINT "_SingleAnswers_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SingleAnswers" ADD CONSTRAINT "_SingleAnswers_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultipleAnswers" ADD CONSTRAINT "_MultipleAnswers_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultipleAnswers" ADD CONSTRAINT "_MultipleAnswers_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
