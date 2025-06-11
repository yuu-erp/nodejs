import { ProductRepostory } from '../repositories/product.repository'
import { Request, Response } from 'express'
import { isAdmined } from '../utils/isAdmin'
import { MediaRepository } from '../repositories/media.repository'

export class ProductController {
  constructor(
    private readonly productRepostory: ProductRepostory,
    private readonly mediaRepotori: MediaRepository
  ) {}
  createProduct = async (req: Request, res: Response) => {
    try {
      if (!req.user || !isAdmined(req.user)) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }
      const item = req.body
      if (!item) throw new Error('không có dữ liệu')
      await this.productRepostory.createItem(item)
      res.status(201).json({ message: 'Product created successfully' })
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
      const { name, description, price, stock, imageId } = req.body
      const ItemId = req.params.id
      if (!name || !description || !price || !stock || !imageId) throw new Error('dữ liệu không được để trống')
      const findItem = await this.productRepostory.findItemById(ItemId)
      if (!findItem) throw new Error('không có dữ liệu')
      const updateItems = {
        name: req.body.name ?? findItem.name,
        description: req.body.description ?? findItem.description,
        price: req.body.price ?? findItem.price,
        stock: req.body.stock ?? findItem.stock,
        imageId: req.body.imageId ?? findItem.media
      }
      await this.productRepostory.updateItem(ItemId, updateItems)
      res.status(200).json({ message: 'Cập nhật thành công' })
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
      if (!itemId) throw new Error('không tìm thấy sản phẩm')
      const findItem = await this.productRepostory.findItemById(itemId)
      if (!findItem) throw new Error('không tìm thấy id sản phẩm')
      await this.productRepostory.deleteItem(itemId)
      const lengthImage = '1'
      const imageIdToDelete: string | null = lengthImage
      const arrImage: string[] = []
      if (typeof imageIdToDelete === 'string' && imageIdToDelete.length > 0) {
        arrImage.push(imageIdToDelete)
      }
      if (arrImage.length > 0) {
        await this.mediaRepotori.removeManymedia(arrImage)
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }
}
