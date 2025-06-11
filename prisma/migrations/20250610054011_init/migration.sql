/*
  Warnings:

  - You are about to drop the column `productId` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_productId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_ProductMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductMedia_B_index" ON "_ProductMedia"("B");

-- AddForeignKey
ALTER TABLE "_ProductMedia" ADD CONSTRAINT "_ProductMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductMedia" ADD CONSTRAINT "_ProductMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
