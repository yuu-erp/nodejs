import multer from 'multer'

const storage = multer.memoryStorage() // dùng bộ nhớ RAM, dùng cho Cloudinary

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // tối đa 10MB
})
