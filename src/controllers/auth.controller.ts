import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { appConfig } from '../config/app.config'
import { UserRepository } from '../repositories/user.repository'

export class AuthController {
  constructor(private readonly userRepository: UserRepository) {}

  private generateAccessToken = (user: { id: string; email: string }): string =>
    jwt.sign(
      { userId: user.id, email: user.email },
      appConfig.jwtAccessSecret as string,
      {
        expiresIn: appConfig.accessTokenExpiration
      } as SignOptions
    )

  private generateRefreshToken = (userId: string): string =>
    jwt.sign(
      { userId },
      appConfig.jwtRefreshSecret as string,
      {
        expiresIn: appConfig.refreshTokenExpiration
      } as SignOptions
    )

  private setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.getMaxAge(appConfig.accessTokenExpiration)
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: this.getMaxAge(appConfig.refreshTokenExpiration)
    })
  }

  private getMaxAge = (expiresIn: string): number => {
    const match = expiresIn.match(/^(\d+)([smhd])$/)
    console.log('match', match)
    if (!match) return 0

    const value = parseInt(match[1])
    const unit = match[2]
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
    return value * (multipliers[unit as keyof typeof multipliers] || 0)
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const existingUser = await this.userRepository.findUserByEmail(email)
      if (existingUser) {
        res.status(409).json({ message: 'Email already in use' })
        return
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = await this.userRepository.createUser({ email, name, passwordHash })

      const accessToken = this.generateAccessToken(newUser)
      const refreshToken = this.generateRefreshToken(newUser.id)

      await this.userRepository.updateRefreshToken(newUser.id, refreshToken)
      this.setAuthCookies(res, accessToken, refreshToken)

      res.status(201).json({ message: 'Register success', accessToken, refreshToken })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' })
        return
      }

      const user = await this.userRepository.findUserByEmail(email)
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }

      const accessToken = this.generateAccessToken(user)
      const refreshToken = this.generateRefreshToken(user.id)

      await this.userRepository.updateRefreshToken(user.id, refreshToken)
      this.setAuthCookies(res, accessToken, refreshToken)

      res.json({ accessToken, refreshToken })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token missing' })
        return
      }

      const decoded = jwt.verify(refreshToken, appConfig.jwtRefreshSecret as string) as { userId: string }
      const user = await this.userRepository.findUserById(decoded.userId)

      if (!user || user.refreshToken !== refreshToken) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const newAccessToken = this.generateAccessToken(user)
      const newRefreshToken = this.generateRefreshToken(user.id)

      await this.userRepository.updateRefreshToken(user.id, newRefreshToken)
      this.setAuthCookies(res, newAccessToken, newRefreshToken)

      res.json({ accessToken: newAccessToken })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken
      if (refreshToken) {
        try {
          const decoded = jwt.verify(refreshToken, appConfig.jwtRefreshSecret as string) as { userId: string }
          await this.userRepository.updateRefreshToken(decoded.userId, '')
        } catch {
          // ignore token errors on logout
        }
      }

      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
