import { Request, Response } from 'express'
import { ProductRepostory } from '../../repositories/product.repository'
import { ApiResponseHandler } from '../../utils'

export class ProductController {
  constructor(private readonly productRepostory: ProductRepostory) {}

  createProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, stock, mediaIds } = req.body
      console.log(req.body)
      if (!name || !description || !price || !stock) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'Missing required fields' }, 'Bad request', 400)
        return
      }
      const product = await this.productRepostory.createItem({
        name,
        description,
        price,
        stock,
        createdById: req.user!.id,
        mediaIds
      })
      ApiResponseHandler.success(
        res,
        { message: 'Product created successfully', product },
        'Product created successfully',
        201
      )
    } catch (error) {
      console.log(error)
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  getProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const product = await this.productRepostory.findItemById(id)
      if (!product) {
        ApiResponseHandler.error(res, { code: 'NOT_FOUND', details: 'Product not found' }, 'Product not found', 404)
        return
      }
      ApiResponseHandler.success(
        res,
        { message: 'Product fetched successfully', product },
        'Product fetched successfully',
        200
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productRepostory.findAllItem()
      ApiResponseHandler.success(
        res,
        { message: 'Products fetched successfully', products },
        'Products fetched successfully',
        200
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { name, description, price, stock, status, mediaIds } = req.body
      if (!name || !description || !price || !stock || !status) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'Missing required fields' }, 'Bad request', 400)
        return
      }
      const product = await this.productRepostory.updateItem(id, {
        name,
        description,
        price,
        stock,
        status,
        mediaIds
      })
      ApiResponseHandler.success(
        res,
        { message: 'Product updated successfully', product },
        'Product updated successfully',
        200
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const product = await this.productRepostory.deleteItem(id)
      ApiResponseHandler.success(
        res,
        { message: 'Product deleted successfully', product },
        'Product deleted successfully',
        200
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }
}
