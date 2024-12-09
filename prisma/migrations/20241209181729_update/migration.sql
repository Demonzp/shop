/*
  Warnings:

  - You are about to alter the column `agent` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "agent" SET DATA TYPE VARCHAR(120);
