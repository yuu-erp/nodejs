/*
  Warnings:

  - You are about to drop the `_ProductMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_createdById_fkey";

-- DropForeignKey
ALTER TABLE "_ProductMedia" DROP CONSTRAINT "_ProductMedia_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductMedia" DROP CONSTRAINT "_ProductMedia_B_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "productId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'UPLOADED';

-- DropTable
DROP TABLE "_ProductMedia";

-- CreateIndex
CREATE INDEX "Media_productId_idx" ON "Media"("productId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
