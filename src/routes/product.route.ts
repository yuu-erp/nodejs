
import { Router } from "express";
import { PrismaService } from "../services/prisma.service";
import { ProductRepostory } from "../repositories/product.repository";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";




const route = Router()
const primsa = new PrismaService
const productRepo = new ProductRepostory(primsa)
const ProductControllers = new ProductController(productRepo)
route.post("/create-product", authMiddleware,ProductControllers.createProduct)
route.post("/update-product/:id", authMiddleware,ProductControllers.updateProduct)


export default route

