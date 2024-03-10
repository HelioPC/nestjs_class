/*
  Warnings:

  - Added the required column `link` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookmarks` ADD COLUMN `link` VARCHAR(191) NOT NULL;
