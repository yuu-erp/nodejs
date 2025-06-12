import { Request, Response } from 'express'
import { CloudinaryService } from '../../services/cloudinary.service'
import { PrismaService } from '../../services/prisma.service'
import { ApiResponseHandler } from '../../utils/api-response-handler'
import { $Enums } from '@prisma/client'
import { error } from 'console'
import { ALL } from 'dns'

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
  ) { }

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
  multilUpload = async (req: Request, res: Response) => {
    try {
      const { files } = req
      const user = req.user
      if (!user?.id) {
         ApiResponseHandler.error(res, { code: "BAD_REQUEST", details: 'Không tồn tại id user' }, "Không tồn tại id user")
        return
      }
      if (!files) {
        ApiResponseHandler.error(res, { code: "BAD_REQUEST", details: 'Vui lòng cung cấp file để upload' }, "Vui lòng cung cấp file để upload")
        return
      }
      const arrFile = req.files as Express.Multer.File[]
      if (!arrFile || !Array.isArray(arrFile) || arrFile.length == 0) {
        ApiResponseHandler.error(res, { code: "BAD_INPUT_IMAGE", details: "Vui lòng cung cấp ít nhất một file để upload" }, 'Vui lòng cung cấp ít nhất một file để upload')
      }
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif']
      for (const files of arrFile) {
        if (!allowedMimeTypes.includes(files.mimetype)) {
          ApiResponseHandler.error(
            res,
            { code: 'BAD_REQUEST', details: 'Định dạng file không được hỗ trợ' },
            'Bad request',
            400
          )
          return
        }
      }
      const uploadFile = await Promise.all(
        arrFile.map(async (file) => {
          const result = await this.cloudinaryService.uploadFromBuffer(file)
          const mimeType = mimeTypeMap[result.resource_type] || 'IMAGE_PNG'
          const media = await this.prismaService.media.create({
            data: {
              url: result.secure_url,
              mimeType,
              size: result.bytes,
              originalName: file.originalname,
              userId: user.id
            }
          })
          return {
            mediaId: media.id,
            url: media.url,
            mimeType: media.mimeType,
            size: media.size
          }

        })
      )
          res.json({
        success: true,
        message: 'Upload nhiều hình ảnh thành công',
        data: uploadFile
      })


    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }
}
