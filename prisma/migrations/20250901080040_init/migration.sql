/*
  Warnings:

  - The values [VALIDE] on the enum `Payement_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payement` MODIFY `status` ENUM('EN_ATTENTE', 'SUCCES', 'ECHOUE', 'REMBOURSE') NOT NULL DEFAULT 'EN_ATTENTE';
