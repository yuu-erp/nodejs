import cookieParser from 'cookie-parser'
import express from 'express'
import { appConfig } from './config/app.config'
import authRoutes from './routes/auth.route'
import uploadRoutes from './routes/upload.route'
import { PrismaService } from './services/prisma.service'
import fileUpload, { UploadedFile } from 'express-fileupload'
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware'

const app = express()
const PORT = appConfig.port
const prisma = new PrismaService()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser())
// app.use(
//   fileUpload({
//     limits: { fileSize: 8 * 1024 * 1024 }, // 8MB file size limit
//     abortOnLimit: true, // Stop upload if limit is exceeded
//     createParentPath: true // Automatically create parent folder if it doesn't exist
//   })
// )

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1', uploadRoutes)

app.use('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.use(errorHandlerMiddleware)

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1`)
  await prisma.onModuleInit()
  console.log('✅ Connected to PostgreSQL')
})
