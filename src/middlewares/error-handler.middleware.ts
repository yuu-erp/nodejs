import { Request, Response, NextFunction } from 'express'
import { ApiResponseHandler } from '../utils'
import { AppError } from '../error/app.error'

export const errorHandlerMiddleware = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    ApiResponseHandler.error(res, { code: err.message, details: err.message }, err.message, err.statusCode)
    return
  }

  // Xử lý lỗi không xác định
  ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR' }, 'Something went wrong', 500)
  return
}
