/*
  Warnings:

  - You are about to drop the column `titre0ffre` on the `offre` table. All the data in the column will be lost.
  - Added the required column `titreOffre` to the `Offre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offre` DROP COLUMN `titre0ffre`,
    ADD COLUMN `titreOffre` VARCHAR(191) NOT NULL;
