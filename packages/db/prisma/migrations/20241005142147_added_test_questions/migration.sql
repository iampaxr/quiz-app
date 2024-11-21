/*
  Warnings:

  - You are about to drop the `_QuestionToUserTestDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_QuestionToUserTestDetail" DROP CONSTRAINT "_QuestionToUserTestDetail_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuestionToUserTestDetail" DROP CONSTRAINT "_QuestionToUserTestDetail_B_fkey";

-- DropTable
DROP TABLE "_QuestionToUserTestDetail";

-- CreateTable
CREATE TABLE "TestQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "choices" TEXT[],
    "anwser" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TestQuestionToUserTestDetail" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TestQuestion_id_key" ON "TestQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_TestQuestionToUserTestDetail_AB_unique" ON "_TestQuestionToUserTestDetail"("A", "B");

-- CreateIndex
CREATE INDEX "_TestQuestionToUserTestDetail_B_index" ON "_TestQuestionToUserTestDetail"("B");

-- AddForeignKey
ALTER TABLE "_TestQuestionToUserTestDetail" ADD CONSTRAINT "_TestQuestionToUserTestDetail_A_fkey" FOREIGN KEY ("A") REFERENCES "TestQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestQuestionToUserTestDetail" ADD CONSTRAINT "_TestQuestionToUserTestDetail_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
