/*
  Warnings:

  - You are about to alter the column `status` on the `payement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `role` on the `utilisateur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `dateExpiration` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Made the column `statut` on table `reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `commentaire` DROP FOREIGN KEY `Commentaire_utilisateurId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_utilisateurId_fkey`;

-- DropForeignKey
ALTER TABLE `payement` DROP FOREIGN KEY `Payement_reservationId_fkey`;

-- DropForeignKey
ALTER TABLE `payement` DROP FOREIGN KEY `Payement_utilisateurId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_utilisateurId_fkey`;

-- DropIndex
DROP INDEX `Commentaire_utilisateurId_fkey` ON `commentaire`;

-- DropIndex
DROP INDEX `Message_utilisateurId_fkey` ON `message`;

-- DropIndex
DROP INDEX `Payement_reservationId_fkey` ON `payement`;

-- DropIndex
DROP INDEX `Payement_utilisateurId_fkey` ON `payement`;

-- DropIndex
DROP INDEX `Reservation_utilisateurId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `offre` MODIFY `imagePrincipale` LONGBLOB NOT NULL;

-- AlterTable
ALTER TABLE `payement` MODIFY `status` ENUM('EN_ATTENTE', 'VALIDE', 'ECHOUE', 'REMBOURSE') NOT NULL DEFAULT 'EN_ATTENTE',
    MODIFY `reservationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `dateExpiration` DATETIME(3) NOT NULL,
    MODIFY `statut` ENUM('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE') NOT NULL DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE `utilisateur` MODIFY `role` ENUM('ADMIN', 'CLIENT') NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payement` ADD CONSTRAINT `Payement_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payement` ADD CONSTRAINT `Payement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
