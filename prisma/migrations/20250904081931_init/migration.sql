/*
  Warnings:

  - You are about to drop the column `commentaireId` on the `offre` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `offre` DROP FOREIGN KEY `Offre_commentaireId_fkey`;

-- DropIndex
DROP INDEX `Offre_commentaireId_fkey` ON `offre`;

-- AlterTable
ALTER TABLE `commentaire` ADD COLUMN `offreId` INTEGER NULL;

-- AlterTable
ALTER TABLE `offre` DROP COLUMN `commentaireId`;

-- AddForeignKey
ALTER TABLE `Commentaire` ADD CONSTRAINT `Commentaire_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
