import { Request, Response, NextFunction } from 'express'
import { ApiResponseHandler } from '../utils'

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    ApiResponseHandler.error(res, { code: 'FORBIDDEN', details: 'Forbidden' }, 'Forbidden', 403)
    return
  }
  next()
}
