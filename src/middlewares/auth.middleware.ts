import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { appConfig } from '../config/app.config'
import { UserPayload } from '../type'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken
  console.log(token)
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const payload = jwt.verify(token, appConfig.jwtAccessSecret!) as UserPayload
    req.user = payload
    console.log(req.user)
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }
}
