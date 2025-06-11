import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { UploadController } from '../../controllers/admin/upload.controller'
import { PrismaService } from '../../services/prisma.service'
import { CloudinaryService } from '../../services/cloudinary.service'
import { requireAdmin } from '../../middlewares/require-admin.middleware'
import { upload } from '../../middlewares/multer.middleware'

const uploadRoutes = Router()

const prismaService = new PrismaService()
const cloudinaryService = new CloudinaryService()
const uploadController = new UploadController(prismaService, cloudinaryService)

uploadRoutes.post('/', upload.single('file'), authMiddleware, requireAdmin, uploadController.upload)

export default uploadRoutes
