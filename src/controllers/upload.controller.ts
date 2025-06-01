import { Request, Response } from 'express'
import { CloudinaryService } from '../services/cloudinary.service'
import { PrismaService } from '../services/prisma.service'
import { UserPayload } from '../type'
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

  // Kiểm tra quyền admin
  private isAdmin(user?: UserPayload | null): boolean {
    if (!user) return false
    return user.role === 'ADMIN'
  }

  /**
   * Upload một hình ảnh lên Cloudinary và lưu metadata vào Prisma.
   * @param req - Request chứa file và thông tin user.
   * @param res - Response để trả về kết quả.
   */
  uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const userReq = req.user
      console.log(userReq)
      if (!userReq?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      // Kiểm tra quyền
      if (!this.isAdmin(userReq)) {
        res.status(401).json({ success: false, message: 'Không có quyền truy cập' })
        return
      }

      // Kiểm tra file
      const { file } = req
      if (!file) {
        res.status(400).json({ success: false, message: 'Vui lòng cung cấp file để upload' })
        return
      }

      // Kiểm tra MIME type (nếu cần)
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif']
      if (!allowedMimeTypes.includes(file.mimetype)) {
        res.status(400).json({ success: false, message: 'Định dạng file không được hỗ trợ' })
        return
      }

      // Upload lên Cloudinary
      const result = await this.cloudinaryService.uploadFromBuffer(file as Express.Multer.File)

      // Ánh xạ resource_type sang MimeType của Prisma
      const mimeType = mimeTypeMap[result.resource_type] || 'IMAGE_PNG' // Fallback nếu không khớp

      // Lưu vào Prisma
      const media = await this.prismaService.media.create({
        data: {
          url: result.secure_url,
          mimeType: mimeType as $Enums.MimeType,
          size: result.bytes,
          originalName: file.originalname,
          userId: userReq.id
        }
      })

      // Trả về phản hồi
      res.json({
        success: true,
        message: 'Upload hình ảnh thành công',
        data: {
          mediaId: media.id,
          url: media.url,
          mimeType: media.mimeType,
          size: media.size
        }
      })
    } catch (error) {
      // Phân loại lỗi
      const message =
        error instanceof Error
          ? error.message.includes('Cloudinary')
            ? 'Lỗi khi upload lên Cloudinary'
            : error.message.includes('Prisma')
              ? 'Lỗi khi lưu vào cơ sở dữ liệu'
              : error.message
          : 'Đã xảy ra lỗi không xác định'
      res.status(500).json({ success: false, message })
    }
  }

  /**
   * Upload nhiều hình ảnh lên Cloudinary và lưu metadata vào Prisma.
   * @param req - Request chứa danh sách file và thông tin user.
   * @param res - Response để trả về kết quả.
   */
  uploadMultipleImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const userReq = req.user
      if (!userReq?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      // Kiểm tra quyền
      if (!this.isAdmin(userReq)) {
        res.status(401).json({ success: false, message: 'Không có quyền truy cập' })
        return
      }

      // Kiểm tra files
      const files = req.files as Express.Multer.File[]
      if (!files || !Array.isArray(files) || files.length === 0) {
        res.status(400).json({ success: false, message: 'Vui lòng cung cấp ít nhất một file để upload' })
        return
      }

      // Kiểm tra MIME type
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif']
      for (const file of files) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          res.status(400).json({ success: false, message: `File ${file.originalname} có định dạng không được hỗ trợ` })
          return
        }
      }

      // Upload từng file và lưu vào Prisma
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const result = await this.cloudinaryService.uploadFromBuffer(file)
          const mimeType = mimeTypeMap[result.resource_type] || 'IMAGE_PNG'
          const media = await this.prismaService.media.create({
            data: {
              url: result.secure_url,
              mimeType,
              size: result.bytes,
              originalName: file.originalname,
              userId: userReq.id
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

      // Trả về phản hồi
      res.json({
        success: true,
        message: 'Upload nhiều hình ảnh thành công',
        data: uploadResults
      })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message.includes('Cloudinary')
            ? 'Lỗi khi upload lên Cloudinary'
            : error.message.includes('Prisma')
              ? 'Lỗi khi lưu vào cơ sở dữ liệu'
              : error.message
          : 'Đã xảy ra lỗi không xác định'
      res.status(500).json({ success: false, message })
    }
  }
}
