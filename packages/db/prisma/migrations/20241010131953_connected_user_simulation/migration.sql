-- AddForeignKey
ALTER TABLE "SimulationTestDetail" ADD CONSTRAINT "SimulationTestDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
