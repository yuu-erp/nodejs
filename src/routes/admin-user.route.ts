import { Router } from 'express'
import { AdminUserController } from '../controllers/admin-user.controller'
import { UserRepository } from '../repositories/user.repository'
import { PrismaService } from '../services/prisma.service'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

const prismaService = new PrismaService()
const userRepository = new UserRepository(prismaService)
const adminUserController = new AdminUserController(userRepository)

router.post('/create-user', authMiddleware, adminUserController.createUser)
router.post('/update-user', authMiddleware, adminUserController.updateUser)

export default router
