-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('TIMER', 'NOTIMER', 'SIMULATION');

-- AlterTable
ALTER TABLE "UserTestDetail" ADD COLUMN     "testType" "TestType" NOT NULL DEFAULT 'TIMER';
