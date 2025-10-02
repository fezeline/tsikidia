/*
  Warnings:

  - You are about to alter the column `role` on the `utilisateur` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `utilisateur` MODIFY `role` VARCHAR(191) NOT NULL;
