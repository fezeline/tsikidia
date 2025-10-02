/*
  Warnings:

  - You are about to drop the column `estConfirm` on the `reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `estConfirm`,
    ADD COLUMN `statut` VARCHAR(191) NULL;
