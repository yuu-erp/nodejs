/*
  Warnings:

  - You are about to drop the column `product` on the `Media` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_product_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "product",
ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
