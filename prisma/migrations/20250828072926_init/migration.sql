/*
  Warnings:

  - You are about to drop the column `utilisateurId` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_utilisateurId_fkey`;

-- DropIndex
DROP INDEX `Message_utilisateurId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `utilisateurId`,
    ADD COLUMN `destinataireId` INTEGER NULL,
    ADD COLUMN `expediteurId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_expediteurId_fkey` FOREIGN KEY (`expediteurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_destinataireId_fkey` FOREIGN KEY (`destinataireId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
