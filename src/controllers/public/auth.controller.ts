import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { UserRepository } from '../../repositories/user.repository'
import { AuthService } from '../../services/auth.service'
import { UserPayload } from '../../type'
import { ApiResponseHandler } from '../../utils'

export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body
      if (!email || !password) {
        ApiResponseHandler.error(
          res,
          { code: 'BAD_REQUEST', details: 'Email, password are required' },
          'Bad Request',
          400
        )
        return
      }
      const existingUser = await this.userRepository.findUserByEmail(email)
      if (existingUser) {
        ApiResponseHandler.error(
          res,
          { code: 'EMAIL_ALREADY_IN_USE', details: 'Email already in use' },
          'Email already in use',
          409
        )
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
      ApiResponseHandler.success(
        res,
        { message: 'Register success', accessToken, refreshToken },
        'Register success',
        201
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
      return
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        ApiResponseHandler.error(
          res,
          { code: 'BAD_REQUEST', details: 'Email, password are required' },
          'Bad Request',
          400
        )
        return
      }
      const user = await this.userRepository.findUserByEmail(email)
      if (!user) {
        ApiResponseHandler.error(res, { code: 'USER_NOT_FOUND', details: 'User not found' }, 'User not found', 404)
        return
      }
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      if (!isPasswordValid) {
        ApiResponseHandler.error(
          res,
          { code: 'INVALID_CREDENTIALS', details: 'Invalid credentials' },
          'Invalid credentials',
          401
        )
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
      ApiResponseHandler.success(res, { message: 'Login success', accessToken, refreshToken }, 'Login success', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
      return
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as UserPayload
      const refreshToken = req.cookies?.refreshToken

      if (!id) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'User not found' }, 'User not found', 404)
        return
      }
      const user = await this.userRepository.findUserById(id)
      if (!user) {
        ApiResponseHandler.error(res, { code: 'USER_NOT_FOUND', details: 'User not found' }, 'User not found', 404)
        return
      }
      if (user.refreshToken !== refreshToken) {
        ApiResponseHandler.error(
          res,
          { code: 'INVALID_CREDENTIALS', details: 'Invalid credentials' },
          'Invalid credentials',
          401
        )
        return
      }
      const accessToken = this.authService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role
      })
      const newRefreshToken = this.authService.generateRefreshToken(user.id)
      await this.userRepository.updateRefreshToken(user.id, newRefreshToken)
      this.authService.setAuthCookies(res, accessToken, newRefreshToken)
      ApiResponseHandler.success(
        res,
        { message: 'Refresh token success', accessToken, newRefreshToken },
        'Refresh token success',
        200
      )
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
      return
    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as UserPayload
      if (!id) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'User not found' }, 'User not found', 404)
        return
      }
      await this.userRepository.updateRefreshToken(id, '')
      res.clearCookie('refreshToken')
      ApiResponseHandler.success(res, { message: 'Logged out successfully' }, 'Logged out successfully', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }
}
