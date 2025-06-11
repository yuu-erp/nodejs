import { Media } from "@prisma/client";
import { PrismaService } from "../services/prisma.service";

export class MediaRepository {
    constructor(private readonly mediaPrisma: PrismaService) { }
    
    async removeManymedia(images: string[]): Promise<{ count: number }> {
        const deleteResult = await this.mediaPrisma.media.deleteMany({
            where: { id: { in: images } }
        });
        return deleteResult
    }
    
    async findByProductId(productId: string): Promise<Media[]> {
        return await this.mediaPrisma.media.findMany({
            where: { product: productId }
        });
    }
}