-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "isMultipleAnswer" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Admin_id_idx" ON "Admin"("id");

-- CreateIndex
CREATE INDEX "Question_isMultipleAnswer_idx" ON "Question"("isMultipleAnswer");

-- CreateIndex
CREATE INDEX "Question_categoryId_idx" ON "Question"("categoryId");
