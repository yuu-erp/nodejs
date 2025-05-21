import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { appConfig } from '../config/app.config'

type RequestWithUser = Request & {
  user?: {
    id: string
    email: string
  }
}

const AuthMiddlerware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')
    if (!token) {
      return res.status(401).json({ message: 'khoogn tìm thấy token' })
    }
    const decodeToken = jwt.verify(token, appConfig.tokenJWT)
    req.user = decodeToken as { id: string; email: string }
    next()
  } catch (error: unknown) {
    res.status(401).json({ message: 'token không hợp lệ' })
  }
}
export default AuthMiddlerware
