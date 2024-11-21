-- CreateIndex
CREATE INDEX "Category_id_idx" ON "Category"("id");

-- CreateIndex
CREATE INDEX "Choices_id_idx" ON "Choices"("id");

-- CreateIndex
CREATE INDEX "Question_id_idx" ON "Question"("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "UserTestDetail_id_idx" ON "UserTestDetail"("id");

-- CreateIndex
CREATE INDEX "UserTestDetail_userId_idx" ON "UserTestDetail"("userId");
