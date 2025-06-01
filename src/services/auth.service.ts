import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserPayload } from '../type'
import { appConfig } from '../config/app.config'

export class AuthService {
  /**
   * Tạo JWT access token cho người dùng.
   * @param user - Đối tượng người dùng chứa id và email.
   * @returns Access token có hiệu lực 15 phút.
   * @throws Error nếu JWT_SECRET không được định nghĩa hoặc tạo token thất bại.
   */
  generateAccessToken(user: UserPayload): string {
    try {
      if (!appConfig.jwtAccessSecret) {
        throw new Error('Biến môi trường JWT_SECRET không được định nghĩa')
      }
      return jwt.sign({ id: user.id, email: user.email, role: user.role }, appConfig.jwtAccessSecret, {
        expiresIn: '15m'
      })
    } catch (error) {
      throw new Error(`Không thể tạo access token: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Tạo JWT refresh token cho người dùng.
   * @param userId - ID của người dùng.
   * @returns Refresh token có hiệu lực 7 ngày.
   * @throws Error nếu JWT_SECRET không được định nghĩa hoặc tạo token thất bại.
   */
  generateRefreshToken(userId: string): string {
    try {
      if (!appConfig.jwtRefreshSecret) {
        throw new Error('Biến môi trường JWT_SECRET không được định nghĩa')
      }
      return jwt.sign({ id: userId }, appConfig.jwtRefreshSecret, { expiresIn: '7d' })
    } catch (error) {
      throw new Error(`Không thể tạo refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Đặt cookie cho access và refresh token.
   * @param res - Đối tượng Response của Express.
   * @param accessToken - JWT access token.
   * @param refreshToken - JWT refresh token.
   */
  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction || false,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'strict'
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction || false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    })
  }
}
