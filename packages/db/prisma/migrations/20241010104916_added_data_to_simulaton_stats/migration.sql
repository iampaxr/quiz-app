-- AlterTable
ALTER TABLE "SimulationTestDetail" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "incorrectAnswers" INTEGER,
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "totalTimeTaken" INTEGER,
ALTER COLUMN "correctAnswers" DROP NOT NULL,
ALTER COLUMN "correctAnswers" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserTestDetail" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "correctAnswers" INTEGER,
ADD COLUMN     "incorrectAnswers" INTEGER,
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "totalTimeTaken" INTEGER;
