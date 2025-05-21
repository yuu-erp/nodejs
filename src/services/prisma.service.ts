import { PrismaClient } from '@prisma/client'

export class PrismaService extends PrismaClient {
  constructor() {
    super()
  }

  async onModuleInit() {
    await this.$connect()
  }
}
