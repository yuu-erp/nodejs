import express from 'express'
import { PrismaService } from './services/prisma.service'
import authRoutes from './routes/auth.route'
import { appConfig } from './config/app.config'
import cookieParser from 'cookie-parser'

const version = 'v1'
const app = express()
const PORT = appConfig.port
const prefix = appConfig.prefix
const prisma = new PrismaService()

app.use(express.json())
app.use(cookieParser())

app.use(`${prefix}/${version}`, authRoutes)

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}${prefix}/${version}`)
  await prisma.onModuleInit()
  console.log('✅ Connected to PostgreSQL')
})
