import { User } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'

export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: {
    email: string
    name: string
    passwordHash: string
    role?: 'ADMIN' | 'USER'
  }): Promise<User> {
    return await this.prisma.user.create({ data: user })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } })
  }

  async updateUser(id: string, user: User) {
    return this.prisma.user.update({ where: { id }, data: user })
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } })
  }

  async findAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<User> {
    return await this.prisma.user.update({ where: { id }, data: { refreshToken } })
  }
}
