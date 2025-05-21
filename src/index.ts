import express from 'express'
import userRoutes from './routes/user.route'
import { PrismaService } from './services/prisma.service'

const PORT = process.env.PORT || 3000

const app = express()
const prisma = new PrismaService()

app.use(express.json())
app.use('/users', userRoutes)

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  await prisma.onModuleInit()
  console.log('✅ Connected to PostgreSQL')
})
