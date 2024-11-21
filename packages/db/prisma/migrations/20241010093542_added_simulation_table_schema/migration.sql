-- CreateTable
CREATE TABLE "SimulationTestDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationTestDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SingleQuestionSimulation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MultipleQuestionSimulation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SimulationTestDetail_id_key" ON "SimulationTestDetail"("id");

-- CreateIndex
CREATE INDEX "SimulationTestDetail_id_userId_idx" ON "SimulationTestDetail"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_SingleQuestionSimulation_AB_unique" ON "_SingleQuestionSimulation"("A", "B");

-- CreateIndex
CREATE INDEX "_SingleQuestionSimulation_B_index" ON "_SingleQuestionSimulation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MultipleQuestionSimulation_AB_unique" ON "_MultipleQuestionSimulation"("A", "B");

-- CreateIndex
CREATE INDEX "_MultipleQuestionSimulation_B_index" ON "_MultipleQuestionSimulation"("B");

-- AddForeignKey
ALTER TABLE "_SingleQuestionSimulation" ADD CONSTRAINT "_SingleQuestionSimulation_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SingleQuestionSimulation" ADD CONSTRAINT "_SingleQuestionSimulation_B_fkey" FOREIGN KEY ("B") REFERENCES "SimulationTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultipleQuestionSimulation" ADD CONSTRAINT "_MultipleQuestionSimulation_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MultipleQuestionSimulation" ADD CONSTRAINT "_MultipleQuestionSimulation_B_fkey" FOREIGN KEY ("B") REFERENCES "SimulationTestDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
