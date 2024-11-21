/*
  Warnings:

  - Added the required column `numberOfQuestions` to the `SimulationTestDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SimulationTestDetail" ADD COLUMN     "correctAnswers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "numberOfQuestions" INTEGER NOT NULL;
