/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestStatistic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TestStatistic" DROP CONSTRAINT "TestStatistic_testId_fkey";

-- DropForeignKey
ALTER TABLE "TestStatistic" DROP CONSTRAINT "TestStatistic_userId_fkey";

-- DropTable
DROP TABLE "Test";

-- DropTable
DROP TABLE "TestStatistic";

-- CreateTable
CREATE TABLE "UserTestDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAnswers" TEXT[],
    "isTimed" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER,
    "correctAnswers" TEXT NOT NULL,
    "numberOfQuestions" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTestDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionToUserTestDetail" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTestDetail_id_key" ON "UserTestDetail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToUserTestDetail_AB_unique" ON "_QuestionToUserTestDetail"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToUserTestDetail_B_index" ON "_QuestionToUserTestDetail"("B");

-- AddForeignKey
ALTER TABLE "UserTestDetail" ADD CONSTRAINT "UserTestDetail_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTestDetail" ADD CONSTRAINT "UserTestDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToUserTestDetail" ADD CONSTRAINT "_QuestionToUserTestDetail_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToUserTestDetail" ADD CONSTRAINT "_QuestionToUserTestDetail_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
