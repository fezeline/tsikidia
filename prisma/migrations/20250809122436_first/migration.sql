/*
  Warnings:

  - You are about to drop the column `datePayement` on the `payement` table. All the data in the column will be lost.
  - You are about to drop the column `methodePayement` on the `payement` table. All the data in the column will be lost.
  - You are about to drop the column `montantPaye` on the `payement` table. All the data in the column will be lost.
  - You are about to drop the column `reservationId` on the `payement` table. All the data in the column will be lost.
  - You are about to drop the column `statusPayement` on the `payement` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payement` table. All the data in the column will be lost.
  - Added the required column `date` to the `Payement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Payement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montant` to the `Payement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Payement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utilisateurId` to the `Payement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payement` DROP FOREIGN KEY `Payement_reservationId_fkey`;

-- DropIndex
DROP INDEX `Payement_reservationId_fkey` ON `payement`;

-- DropIndex
DROP INDEX `Utilisateur_email_key` ON `utilisateur`;

-- AlterTable
ALTER TABLE `payement` DROP COLUMN `datePayement`,
    DROP COLUMN `methodePayement`,
    DROP COLUMN `montantPaye`,
    DROP COLUMN `reservationId`,
    DROP COLUMN `statusPayement`,
    DROP COLUMN `transactionId`,
    ADD COLUMN `date` DATETIME(3) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `modePayement` VARCHAR(191) NULL,
    ADD COLUMN `montant` DOUBLE NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `utilisateurId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Payement` ADD CONSTRAINT `Payement_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
