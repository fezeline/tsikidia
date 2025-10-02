/*
  Warnings:

  - You are about to drop the column `heureActivite` on the `activite` table. All the data in the column will be lost.
  - Added the required column `dateActivite` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activite` DROP COLUMN `heureActivite`,
    ADD COLUMN `dateActivite` DATETIME(3) NOT NULL;
