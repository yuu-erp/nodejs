import { Response } from 'express'

interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
  error?: {
    code: string
    details?: unknown
  }
}

export class ApiResponseHandler {
  static success<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200) {
    const response: ApiResponse<T> = {
      status: 'success',
      data,
      message
    }
    return res.status(statusCode).json(response)
  }

  static error(res: Response, error: { code: string; details?: unknown }, message: string, statusCode: number = 400) {
    const response: ApiResponse<null> = {
      status: 'error',
      message,
      error: {
        code: error.code,
        details: error.details
      }
    }
    return res.status(statusCode).json(response)
  }
}
