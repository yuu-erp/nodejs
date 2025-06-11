import { Router } from 'express'
import { UserController } from '../../controllers/admin/user.controller'
import { UserRepository } from '../../repositories/user.repository'
import { PrismaService } from '../../services/prisma.service'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/require-admin.middleware'
import { ApiResponseHandler } from '../../utils/api-response-handler'

const adminUserRoutes = Router()
const prismaService = new PrismaService()
const userRepository = new UserRepository(prismaService)
const userController = new UserController(userRepository)

adminUserRoutes.post('/', authMiddleware, requireAdmin, userController.createUser)
adminUserRoutes.put('/:id', authMiddleware, requireAdmin, userController.updateUser)
adminUserRoutes.delete('/:id', authMiddleware, requireAdmin, userController.deleteUser)
adminUserRoutes.get('/:id', authMiddleware, requireAdmin, userController.getUserById)
adminUserRoutes.get('/', authMiddleware, requireAdmin, userController.getUsers)
adminUserRoutes.get('/email/:email', authMiddleware, requireAdmin, userController.getUserByEmail)

export default adminUserRoutes
