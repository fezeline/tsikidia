/*
  Warnings:

  - The values [TERMINEE] on the enum `Reservation_statut` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `reservation` MODIFY `statut` ENUM('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE') NOT NULL DEFAULT 'EN_ATTENTE';
