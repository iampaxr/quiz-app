-- AlterTable
ALTER TABLE "SimulationTestDetail" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "testType" "TestType" NOT NULL DEFAULT 'SIMULATION';
