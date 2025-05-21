import express from 'express'
import { UserController } from '../controllers/user.controller'
import { PrismaService } from '../services/prisma.service'
import { UserService } from '../services/user.service'

const router = express.Router()
const prisma = new PrismaService()
const userService = new UserService(prisma)
const userController = new UserController(userService)

router.get('/', userController.getAllUsers)

router.post('/', userController.createUser)

export default router
