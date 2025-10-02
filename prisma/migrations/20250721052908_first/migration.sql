/*
  Warnings:

  - You are about to alter the column `titre0ffre` on the `offre` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `offre` MODIFY `titre0ffre` INTEGER NOT NULL;
