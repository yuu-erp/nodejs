import { Request } from 'express'

declare global {
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
