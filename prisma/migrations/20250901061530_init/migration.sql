/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `Payement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `payement` ADD COLUMN `stripePaymentIntentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Payement_stripePaymentIntentId_key` ON `Payement`(`stripePaymentIntentId`);
