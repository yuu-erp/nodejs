import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { UserRepository } from '../repositories/user.repository'
import { PrismaService } from '../services/prisma.service'

const router = Router()

const prismaService = new PrismaService()
const userRepository = new UserRepository(prismaService)
const authController = new AuthController(userRepository)

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/refresh-token', authController.refreshToken)

router.post('/logout', authController.logout)

export default router
