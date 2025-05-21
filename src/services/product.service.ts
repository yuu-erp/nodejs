import { PrismaService } from './prisma.service'

export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}
}
