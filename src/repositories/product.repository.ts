import { Product } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

export class ProductRepostory {
  constructor(private readonly productPrisma: PrismaService) {}

  async createItem(item: {
    name: string
    description: string
    price: number
    stock: number
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED'
    createdById: string
    imageId?: string
  }): Promise<Product> {
    return this.productPrisma.product.create({ data: item })
  }

  async findItemById(id: string): Promise<Product | null> {
    return await this.productPrisma.product.findUnique({ where: { id } })
  }

  async updateItem(id: string, item: Product) {
    return this.productPrisma.product.update({ where: { id }, data: item })
  }

  async deleteItem(id: string): Promise<Product> {
    return await this.productPrisma.product.delete({ where: { id } })
  }

  async findAllItem(): Promise<Product[]> {
    return await this.productPrisma.product.findMany()
  }
}
