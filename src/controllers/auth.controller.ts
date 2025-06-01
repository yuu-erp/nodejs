import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { UserRepository } from '../repositories/user.repository'
import { AuthService } from '../services/auth.service'
import { LoggerService } from '../services/logger.service'

export class AuthController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    private readonly authService: AuthService
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body
      this.logger.info('Registering user', { email, name, password })
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

      const accessToken = this.authService.generateAccessToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      })
      const refreshToken = this.authService.generateRefreshToken(newUser.id)

      await this.userRepository.updateRefreshToken(newUser.id, refreshToken)
      this.authService.setAuthCookies(res, accessToken, refreshToken)

      res.status(201).json({ message: 'Register success', accessToken, refreshToken })
    } catch (error) {
      this.logger.error('Register user error', { error })
      res.status(500).json({ message: error })
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

      const accessToken = this.authService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
      })
      const refreshToken = this.authService.generateRefreshToken(user.id)

      await this.userRepository.updateRefreshToken(user.id, refreshToken)
      this.authService.setAuthCookies(res, accessToken, refreshToken)

      res.json({ accessToken, refreshToken })
    } catch (error) {
      this.logger.error('Login user error', { error })
      res.status(500).json({ message: (error as Error).message || 'Internal server error' })
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const userReq = req.user
      const refreshToken = req.cookies?.refreshToken
      if (!userReq?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const user = await this.userRepository.findUserById(userReq.id)

      if (!user || user.refreshToken !== refreshToken) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }

      const newAccessToken = this.authService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
      })
      const newRefreshToken = this.authService.generateRefreshToken(user.id)

      await this.userRepository.updateRefreshToken(user.id, newRefreshToken)
      this.authService.setAuthCookies(res, newAccessToken, newRefreshToken)

      res.json({ accessToken: newAccessToken })
    } catch (error) {
      this.logger.error('Refresh token error', { error })
      res.status(500).json({ message: (error as Error).message || 'Internal server error' })
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userReq = req.user
      if (!userReq?.id) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
      await this.userRepository.updateRefreshToken(userReq.id, '')

      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
      this.logger.error('Logout user error', { error })
      res.status(500).json({ message: (error as Error).message || 'Internal server error' })
    }
  }

  registerAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body
      this.logger.info('Registering admin', { email, name, password })
      const existingUser = await this.userRepository.findUserByEmail(email)
      if (existingUser) {
        res.status(409).json({ message: 'Email already in use' })
        return
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = await this.userRepository.createUser({ email, name, passwordHash, role: 'ADMIN' })

      const accessToken = this.authService.generateAccessToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      })
      const refreshToken = this.authService.generateRefreshToken(newUser.id)

      await this.userRepository.updateRefreshToken(newUser.id, refreshToken)
      this.authService.setAuthCookies(res, accessToken, refreshToken)

      res.status(201).json({ message: 'Register admin success', accessToken, refreshToken })
    } catch (error) {
      this.logger.error('Register admin error', { error })
      res.status(500).json({ message: (error as Error).message || 'Internal server error' })
    }
  }
}
