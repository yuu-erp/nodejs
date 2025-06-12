import {v2 as cloudinary, UploadApiResponse} from "cloudinary"
export class CloudinaryService {
    constructor(){
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
        })
    }
     async uploadFromPath(filePath: string): Promise<UploadApiResponse> {
        return await cloudinary.uploader.upload(filePath)
      }
    async  async uploadFromBuffer(file: Express.Multer.File): Promise<UploadApiResponse> {}

}