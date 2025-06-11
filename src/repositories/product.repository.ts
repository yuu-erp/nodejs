import { Product } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

export class ProductRepostory {
  constructor(private readonly productPrisma: PrismaService) {}

  async createItem(item: {
    name: string
    description: string
    price: number
    stock: number
    createdById: string
    mediaIds?: string[]
  }): Promise<Product> {
    console.log(item)
    return await this.productPrisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        createdById: item.createdById,
        media: item.mediaIds ? { connect: item.mediaIds.map((id) => ({ id })) } : undefined
      },
      include: {
        media: true
      }
    })
  }

  async findItemById(id: string): Promise<Product | null> {
    return await this.productPrisma.product.findUnique({ where: { id } })
  }

  async updateItem(
    id: string,
    item: {
      name: string
      description: string
      price: number
      stock: number
      status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED'
      mediaIds?: string[]
    }
  ) {
    console.log(item)
    return await this.productPrisma.product.update({
      where: { id },
      data: {
        ...item,
        media: item.mediaIds ? { connect: item.mediaIds.map((id) => ({ id })) } : undefined
      }
    })
  }

  async deleteItem(id: string): Promise<Product> {
    return await this.productPrisma.product.delete({ where: { id } })
  }

  async findAllItem(): Promise<Product[]> {
    return await this.productPrisma.product.findMany()
  }
}
