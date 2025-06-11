import { Media, Product } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

type ProductWithMedia = Product & { media: Media[] }

export class ProductRepostory {
  constructor(private readonly productPrisma: PrismaService) {}

  async createItem(item: {
    name: string
    description: string
    price: number
    stock: number
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED'
    createdById: string
    media?: []
  }): Promise<Product> {
    return await this.productPrisma.product.create({ data:item })
  }

  async findItemById(id: string): Promise<ProductWithMedia | null> {
    return await this.productPrisma.product.findUnique({ where: { id }, include: { media: true } })
  }

  async updateItem(id: string, item: Partial<Product>) {
    return await this.productPrisma.product.update({ where: { id }, data: item })
  }

  async deleteItem(id: string): Promise<Product> {
    return await this.productPrisma.product.delete({ where: { id } })
  }

  async findAllItem(): Promise<Product[]> {
    return await this.productPrisma.product.findMany()
  }
}
