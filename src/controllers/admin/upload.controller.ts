import { Request, Response } from 'express'
import { CloudinaryService } from '../../services/cloudinary.service'
import { PrismaService } from '../../services/prisma.service'
import { ApiResponseHandler } from '../../utils/api-response-handler'
import { $Enums } from '@prisma/client'

// Định nghĩa ánh xạ từ Cloudinary resource_type sang MimeType của Prisma
const mimeTypeMap: { [key: string]: $Enums.MimeType } = {
  image: 'IMAGE_PNG', // Giả sử PNG là mặc định, có thể mở rộng
  video: 'VIDEO_MP4',
  raw: 'PDF'
}

export class UploadController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  upload = async (req: Request, res: Response) => {
    try {
      const { file } = req
      console.log(file)
      if (!file) {
        ApiResponseHandler.error(
          res,
          { code: 'BAD_REQUEST', details: 'Vui lòng cung cấp file để upload' },
          'Bad request',
          400
        )
        return
      }
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif']
      if (!allowedMimeTypes.includes(file.mimetype)) {
        ApiResponseHandler.error(
          res,
          { code: 'BAD_REQUEST', details: 'Định dạng file không được hỗ trợ' },
          'Bad request',
          400
        )
        return
      }
      const result = await this.cloudinaryService.uploadFromBuffer(file as Express.Multer.File)
      const mimeType = mimeTypeMap[result.resource_type] || 'IMAGE_PNG' // Fallback nếu không khớp
      // Lưu vào Prisma
      const media = await this.prismaService.media.create({
        data: {
          url: result.secure_url,
          mimeType: mimeType as $Enums.MimeType,
          size: result.bytes,
          originalName: file.originalname,
          userId: req.user!.id
        }
      })
      ApiResponseHandler.success(
        res,
        { message: 'File uploaded successfully', media },
        'File uploaded successfully',
        200
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }
}
