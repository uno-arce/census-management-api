/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName,birthDate]` on the table `Records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Records_firstName_lastName_birthDate_key" ON "Records"("firstName", "lastName", "birthDate");
