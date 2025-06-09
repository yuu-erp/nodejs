import { ProductRepostory } from "../repositories/product.repository";
import { Request, Response } from "express";
import { isAdmined } from "../utils/isAdmin";

export class ProductController {
    constructor(private readonly productRepostory: ProductRepostory) { }
    createProduct = async (req: Request, res: Response) => {
        try {
            if (!req.user || !isAdmined(req.user)) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            const item = req.body
            if (!item) throw new Error("không có dữ liệu")
            await this.productRepostory.createItem(item)
            res.status(201).json({ message: 'Product created successfully' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }
    updateProduct = async (req: Request, res: Response) => {
        try {
             if (!req.user || !isAdmined(req.user)) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            const item = req.body
            
        } catch (error) {
             res.status(500).json({ message: (error as Error).message })
        }
    }
    
}