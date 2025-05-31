import { Product } from "@prisma/client";
import { PrismaService } from "../services/prisma.service";

export class ProductRepository{
    constructor (private readonly prisma:PrismaService){}
     async createProduct(data: Product): Promise<Product> {
        return await this.prisma.product.create({ data });
    }
    async getAllProducts(): Promise<Product[]> {
        return await this.prisma.product.findMany();
    }
    async getProductById(id: string): Promise<Product | null> {
        return await this.prisma.product.findUnique({ where: { id } });
    }
    async updateProduct(id: string, data: Product): Promise<Product> {
        return await this.prisma.product.update({
            where: { id },
            data:data,
        });
    }
    async deleteProduct(id: string): Promise<Product> {
        return await this.prisma.product.delete({
            where: { id },
        });
    }

}