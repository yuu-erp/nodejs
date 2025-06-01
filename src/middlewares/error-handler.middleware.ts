import { Request, Response, NextFunction } from 'express'
import { AppError } from '../error/app.error'

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err)

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
    return
  }

  // Lỗi không kiểm soát
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
  return
}
