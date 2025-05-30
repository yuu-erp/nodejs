-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
