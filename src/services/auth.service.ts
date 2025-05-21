import { PrismaService } from './prisma.service'

export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
}
