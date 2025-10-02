-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_offreId_fkey`;

-- DropIndex
DROP INDEX `Reservation_offreId_fkey` ON `reservation`;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_offreId_fkey` FOREIGN KEY (`offreId`) REFERENCES `Offre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
