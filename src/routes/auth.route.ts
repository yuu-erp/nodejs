import { Router } from 'express'
import { PrismaService } from '../services/prisma.service'
import { AuthService } from '../services/auth.service'
import { AuthController } from '../controllers/auth.controller'

const router = Router()
const prisma = new PrismaService()
const authService = new AuthService(prisma)
const authController = new AuthController(authService)

// TODO: LOGIN
router.post('/login', (req, res) => {})
// TODO: RREGISTER
router.post('/register', (req, res) => {})
// TODO: REFRESH TOKEN
router.post('/refresh-token', (req, res) => {})
// TODO: LOGOUT
router.post('/logout', (req, res) => {})
