import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { AuthService } from '../services/auth.service'
import { PrismaService } from '../services/prisma.service'
import authMiddlerware from '../middlewares/auth.middelware'

const router = Router()
const prisma = new PrismaService()
const authService = new AuthService(prisma)
const authController = new AuthController(authService)

// TODO: LOGIN
router.post('/login', authController.login)
// TODO: RREGISTER
router.post('/register', authController.register)
// TODO: REFRESH TOKEN
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.get('/refresh-token', authMiddlerware, authController.refreshtoken)
// TODO: LOGOUT
router.post('/logout', authController.logout)
export default router
