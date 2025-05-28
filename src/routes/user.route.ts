/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express'
import { UserController } from '../controllers/user.controller'
import { PrismaService } from '../services/prisma.service'
import { UserService } from '../services/user.service'
import authMiddlerware from '../middlewares/auth.middelware'
import authorizeRole from '../middlewares/authorize-role.middelware'

const router = express.Router()
const prisma = new PrismaService()
const userService = new UserService(prisma)
const userController = new UserController(userService)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.get('/', authMiddlerware, authorizeRole(['admin']), userController.getAllUsers)

router.post('/', userController.createUser)

// @ts-expect-error
router.delete('/:id', authMiddlerware, authorizeRole(['admin', 'user']), userController.deleteUser)
// @ts-expect-error
router.put('/:id', authMiddlerware, authorizeRole(['admin', 'user']), userController.updateUser)

export default router
