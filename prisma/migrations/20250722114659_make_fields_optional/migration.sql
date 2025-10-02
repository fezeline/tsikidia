/*
  Warnings:

  - You are about to drop the column `montantTotal` on the `reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `montantTotal`,
    ADD COLUMN `prixParPersonne` DOUBLE NULL;

-- AlterTable
ALTER TABLE `voiture` ADD COLUMN `nombreJours` INTEGER NULL;
