import { Request } from 'express'

declare global { //bất kỳ đâu bạn dùng req.user, TypeScript hiểu rõ kiểu,
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: $Enums.Role
      }
    }
  }
}

export interface UserPayload {
  id: string
  email: string
  role: $Enums.Role
}
