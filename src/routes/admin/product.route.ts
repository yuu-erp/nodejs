import { Router } from 'express'
import { ProductController } from '../../controllers/admin/product.controller'
import { ProductRepostory } from '../../repositories/product.repository'
import { PrismaService } from '../../services/prisma.service'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { requireAdmin } from '../../middlewares/require-admin.middleware'

const productRoutes = Router()
const prismaService = new PrismaService()
const productRepository = new ProductRepostory(prismaService)
const productController = new ProductController(productRepository)

productRoutes.post('/', authMiddleware, requireAdmin, productController.createProduct)
productRoutes.get('/:id', authMiddleware, requireAdmin, productController.getProductById)
productRoutes.get('/', authMiddleware, requireAdmin, productController.getProducts)
productRoutes.put('/:id', authMiddleware, requireAdmin, productController.updateProduct)
productRoutes.delete('/:id', authMiddleware, requireAdmin, productController.deleteProduct)

export default productRoutes
