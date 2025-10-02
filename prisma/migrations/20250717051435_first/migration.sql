/*
  Warnings:

  - You are about to alter the column `duree` on the `offre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `offre` MODIFY `duree` INTEGER NOT NULL;
