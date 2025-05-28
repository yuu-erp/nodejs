import { Request, Response, NextFunction } from 'express'

type RequestWithUser = Request & {
  user?: {
    id: string
    email: string
    role: string
  }
}

const authorizeRole = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req?.user?.role as string)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' })
    }
    next()
  }
}
export default authorizeRole
