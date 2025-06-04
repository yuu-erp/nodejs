import cookieParser from 'cookie-parser'
import express from 'express'
import { appConfig } from './config/app.config'
import authRoutes from './routes/auth.route'
import uploadRoutes from './routes/upload.route'
import adminUserRoutes from "./routes/admin-user.route"
import { PrismaService } from './services/prisma.service'
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware'

const app = express()
const PORT = appConfig.port
const prisma = new PrismaService()

app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(cookieParser())


app.use('/api/v1/auth', authRoutes)
app.use('/api/v1', uploadRoutes)
app.use('/api/v1/admin-user',adminUserRoutes)

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
