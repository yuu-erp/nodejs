import { Router } from 'express'
import { CloudinaryService } from '../services/cloudinary.service'
import { PrismaService } from '../services/prisma.service'
import { UploadController } from '../controllers/upload.controller'
import { upload } from '../middlewares/multer.middleware'

const router = Router()

const prismaService = new PrismaService()
const cloudinaryService = new CloudinaryService()

const uploadController = new UploadController(prismaService, cloudinaryService)

router.post('/upload', upload.single('file'), uploadController.uploadImage)
router.post('/upload-multiple', upload.array('files'), uploadController.uploadMultipleImages)

export default router
