import { PrismaService } from '../services/prisma.service'

export class MediaRepository {
  constructor(private readonly mediaPrisma: PrismaService) {}
  async removeManymedia(images: string[]): Promise<void> {
    await this.mediaPrisma.media.deleteMany({
      where: { id: { in: images } }
    })
  }
}
