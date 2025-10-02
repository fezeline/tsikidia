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

-- AddForeignKey
ALTER TABLE `Visite` ADD CONSTRAINT `Visite_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Voiture` ADD CONSTRAINT `Voiture_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
