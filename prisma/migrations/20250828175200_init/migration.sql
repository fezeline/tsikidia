/*
  Warnings:

  - You are about to drop the column `visiteId` on the `activite` table. All the data in the column will be lost.
  - You are about to drop the column `visiteId` on the `hebergement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `activite` DROP FOREIGN KEY `Activite_visiteId_fkey`;

-- DropForeignKey
ALTER TABLE `hebergement` DROP FOREIGN KEY `Hebergement_visiteId_fkey`;

-- DropIndex
DROP INDEX `Activite_visiteId_fkey` ON `activite`;

-- DropIndex
DROP INDEX `Hebergement_visiteId_fkey` ON `hebergement`;

-- AlterTable
ALTER TABLE `activite` DROP COLUMN `visiteId`;

-- AlterTable
ALTER TABLE `hebergement` DROP COLUMN `visiteId`;

-- AlterTable
ALTER TABLE `visite` ADD COLUMN `activiteId` INTEGER NULL,
    ADD COLUMN `hebergementId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Visite` ADD CONSTRAINT `Visite_activiteId_fkey` FOREIGN KEY (`activiteId`) REFERENCES `Activite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visite` ADD CONSTRAINT `Visite_hebergementId_fkey` FOREIGN KEY (`hebergementId`) REFERENCES `Hebergement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
