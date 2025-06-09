/*
  Warnings:

  - You are about to drop the column `imageId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_imageId_fkey";

-- DropIndex
DROP INDEX "Product_imageId_idx";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "product" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageId";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_product_fkey" FOREIGN KEY ("product") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
