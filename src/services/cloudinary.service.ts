import { v2 as cloudinary } from 'cloudinary'

export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
  async uploadImage(filePath: string) {
    return await cloudinary.uploader.upload(filePath)
  }

  async deleteImage(publicId: string) {
    return await cloudinary.uploader.destroy(publicId)
  }
}