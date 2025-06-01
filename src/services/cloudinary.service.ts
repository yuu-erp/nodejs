import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { Readable } from 'stream'

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
  }

  async uploadFromPath(filePath: string): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(filePath)
  }

  async uploadFromBuffer(file: Express.Multer.File): Promise<UploadApiResponse> {
    const stream = new Readable()
    stream.push(file.buffer)
    stream.push(null)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error)
        resolve(result as UploadApiResponse)
      })

      stream.pipe(uploadStream)
    })
  }

  async uploadFromUrl(url: string): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(url)
  }

  async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId)
  }
}
