import { Router } from 'express'
import { PrismaService } from '../services/prisma.service'
import { AuthService } from '../services/auth.service'
import { AuthController } from '../controllers/auth.controller'

const router = Router()
const prisma = new PrismaService()
const authService = new AuthService(prisma)
const authController = new AuthController(authService)

// TODO: LOGIN
router.post('/login',authController.login)
// TODO: RREGISTER
router.post('/register',authController.register)
// TODO: REFRESH TOKEN
router.post('/refresh-token', authController.refreshtoken)
// TODO: LOGOUT
router.post('/logout', authController.logout)
export default router
