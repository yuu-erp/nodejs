import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { appConfig } from '../config/app.config'

const authMiddlerware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'khoogn tìm thấy token' })
    }
    const decodeToken = jwt.verify(token, appConfig.tokenJWT)
    ;(req as any).user = decodeToken as { id: string; email: string; role: string }
    next()
  } catch (error: unknown) {
    console.log(error)
    res.status(401).json({ message: 'token không hợp lệ' })
  }
}
export default authMiddlerware
