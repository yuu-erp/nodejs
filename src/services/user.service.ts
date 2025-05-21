import { CreateUserDto } from '../dtos/create-user.dto'
import { PrismaService } from './prisma.service'

export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
    const { email, name, password } = user
    if (!email || !name || !password) {
      throw new Error('All fields are required')
    }
    const existingUser = await this.prismaService.user.findUnique({ where: { email } })
    if (existingUser) {
      throw new Error('User already exists')
    }
    return this.prismaService.user.create({ data: { email, name, password } })
  }

  async getAllUsers() {
    return this.prismaService.user.findMany()
  }
}
