/*
  Warnings:

  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(120)` to `VarChar(80)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(80);
