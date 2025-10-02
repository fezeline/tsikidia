/*
  Warnings:

  - You are about to drop the column `offreId` on the `commentaire` table. All the data in the column will be lost.
  - You are about to drop the column `offreId` on the `visite` table. All the data in the column will be lost.
  - You are about to drop the column `offreId` on the `voiture` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `commentaire` DROP FOREIGN KEY `Commentaire_offreId_fkey`;

-- DropForeignKey
ALTER TABLE `visite` DROP FOREIGN KEY `Visite_offreId_fkey`;

-- DropForeignKey
ALTER TABLE `voiture` DROP FOREIGN KEY `Voiture_offreId_fkey`;

-- DropIndex
DROP INDEX `Commentaire_offreId_fkey` ON `commentaire`;

-- DropIndex
DROP INDEX `Visite_offreId_fkey` ON `visite`;

-- DropIndex
DROP INDEX `Voiture_offreId_fkey` ON `voiture`;

-- AlterTable
ALTER TABLE `commentaire` DROP COLUMN `offreId`;

-- AlterTable
ALTER TABLE `offre` ADD COLUMN `commentaireId` INTEGER NULL,
    ADD COLUMN `visiteId` INTEGER NULL,
    ADD COLUMN `voitureId` INTEGER NULL;

-- AlterTable
ALTER TABLE `visite` DROP COLUMN `offreId`;

-- AlterTable
ALTER TABLE `voiture` DROP COLUMN `offreId`;

-- AddForeignKey
ALTER TABLE `Offre` ADD CONSTRAINT `Offre_visiteId_fkey` FOREIGN KEY (`visiteId`) REFERENCES `Visite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offre` ADD CONSTRAINT `Offre_voitureId_fkey` FOREIGN KEY (`voitureId`) REFERENCES `Voiture`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offre` ADD CONSTRAINT `Offre_commentaireId_fkey` FOREIGN KEY (`commentaireId`) REFERENCES `Commentaire`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
