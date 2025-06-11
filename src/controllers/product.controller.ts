import { ProductRepostory } from "../repositories/product.repository";
import { Request, Response } from "express";
import { isAdmined } from "../utils/isAdmin";
import { MediaRepository } from "../repositories/media.repository";

export class ProductController {
    constructor(private readonly productRepostory: ProductRepostory,
        private readonly mediaRepotori: MediaRepository
    ) { }
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
            const { name, description, price, stock } = req.body
            const ItemId = req.params.id
            
            // Kiểm tra sản phẩm tồn tại
            const findItem = await this.productRepostory.findItemById(ItemId)
            if (!findItem) {
                res.status(404).json({ message: 'Sản phẩm không tồn tại' })
                return
            }
            
            // Chỉ update những field được cung cấp
            const updateItems = {
                name: name ?? findItem.name,
                description: description ?? findItem.description,
                price: price ?? findItem.price,
                stock: stock ?? findItem.stock,
            }
            
            await this.productRepostory.updateItem(ItemId, updateItems)
            res.status(200).json({ message: 'Cập nhật thành công' });

        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }
    deleteProduct = async (req: Request, res: Response) => {
        try {
            if (!req.user || !isAdmined(req.user)) {
                res.status(403).json({ message: 'Forbidden' })
                return
            }
            const itemId = req.params.id
            if (!itemId) {
                res.status(400).json({ message: 'ID sản phẩm không được để trống' })
                return
            }
            
            // Kiểm tra sản phẩm tồn tại
            const findItem = await this.productRepostory.findItemById(itemId)
            if (!findItem) {
                res.status(404).json({ message: 'Sản phẩm không tồn tại' })
                return
            }
            
            // Xóa các media liên quan trước
            const productMedia = await this.mediaRepotori.findByProductId(itemId)
            if (productMedia.length > 0) {
                const mediaIds = productMedia.map(media => media.id)
                await this.mediaRepotori.removeManymedia(mediaIds)
            }
            
            // Xóa sản phẩm
            await this.productRepostory.deleteItem(itemId)
            
            res.status(200).json({ 
                message: 'Xóa sản phẩm thành công',
                deletedMediaCount: productMedia.length
            });

        } catch (error) {
            res.status(500).json({ message: (error as Error).message })
        }
    }

}