import cookieParser from 'cookie-parser'
import express from 'express'
import { appConfig } from './config/app.config'
import adminUserRoutes from './routes/admin/user.route'
import authRoutes from './routes/public/auth.route'
import { PrismaService } from './services/prisma.service'
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware'
import uploadRoutes from './routes/admin/upload.route'
import productRoutes from './routes/admin/product.route'

const app = express()
const PORT = appConfig.port
const prisma = new PrismaService()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/admin/user', adminUserRoutes)
app.use('/api/v1/admin/upload', uploadRoutes)
app.use('/api/v1/admin/product', productRoutes)

app.use(errorHandlerMiddleware)

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1`)
  await prisma.onModuleInit()
  console.log('✅ Connected to PostgreSQL')
})
