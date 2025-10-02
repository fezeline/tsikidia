/*
  Warnings:

  - Added the required column `reservationId` to the `Payement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payement` ADD COLUMN `reservationId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Payement` ADD CONSTRAINT `Payement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
