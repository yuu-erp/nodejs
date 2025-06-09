import { Media } from "@prisma/client";
import { PrismaService } from "../services/prisma.service";

export class MediaRepository {
    constructor(private readonly mediaPrisma: PrismaService) { }
    async removeManymedia(images: string[]): Promise<Media[]> {
        const mediasToDelete = await this.mediaPrisma.media.findMany({
            where: { id: { in: images } }
        });
         await this.mediaPrisma.media.deleteMany({
            where: { id: { in: images } }
        });
         return mediasToDelete
        
    }
}