/*
  Warnings:

  - You are about to drop the column `phoneNuber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phoneNuber",
ADD COLUMN     "phoneNumber" TEXT;
