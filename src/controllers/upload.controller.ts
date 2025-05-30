import { Request, Response } from 'express'
import { CloudinaryService } from '../services/cloudinary.service'
import { PrismaService } from '../services/prisma.service'

export class UploadController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {
    console.log('UploadController')
  }

  uploadImage = async (req: Request, res: Response): Promise<void> => {
    const { file, body } = req
    console.log(file)
    console.log(body)

    res.send('Hello World Upload')
  }

  uploadMultipleImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { files } = req
      console.log(files)
      if (!files) {
        res.status(400).json({
          success: false,
          message: 'Please specify files or URLs for upload.'
        })
        return
      }
      res.send('Hello World Upload Multiple Images')
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred.'
      })
    }
  }
}
