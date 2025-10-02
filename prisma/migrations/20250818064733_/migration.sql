-- DropForeignKey
ALTER TABLE `activite` DROP FOREIGN KEY `Activite_visiteId_fkey`;

-- DropForeignKey
ALTER TABLE `hebergement` DROP FOREIGN KEY `Hebergement_visiteId_fkey`;

-- DropIndex
DROP INDEX `Activite_visiteId_fkey` ON `activite`;

-- DropIndex
DROP INDEX `Hebergement_visiteId_fkey` ON `hebergement`;

-- AddForeignKey
ALTER TABLE `Activite` ADD CONSTRAINT `Activite_visiteId_fkey` FOREIGN KEY (`visiteId`) REFERENCES `Visite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hebergement` ADD CONSTRAINT `Hebergement_visiteId_fkey` FOREIGN KEY (`visiteId`) REFERENCES `Visite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
