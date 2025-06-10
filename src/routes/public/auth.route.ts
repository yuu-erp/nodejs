import { Router } from 'express'
import { AuthController } from '../../controllers/public/auth.controller'
import { UserRepository } from '../../repositories/user.repository'
import { AuthService } from '../../services/auth.service'
import { PrismaService } from '../../services/prisma.service'
import { authMiddleware } from '../../middlewares/auth.middleware'

const authRoutes = Router()

const authService = new AuthService()
const prismaService = new PrismaService()
const userRepository = new UserRepository(prismaService)
const authController = new AuthController(authService, userRepository)

authRoutes.post('/register', authController.register)
authRoutes.post('/login', authController.login)
authRoutes.post('/refresh-token', authMiddleware, authController.refreshToken)
authRoutes.post('/logout', authMiddleware, authController.logout)

export default authRoutes
