import { UserRepository } from '../../repositories/user.repository'
import { UserPayload } from '../../type'
import { ApiResponseHandler } from '../../utils'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body
      if (!email || !password) {
        ApiResponseHandler.error(
          res,
          { code: 'BAD_REQUEST', details: 'Email, password name are required' },
          'Bad Request',
          400
        )
        return
      }
      const existingUser = await this.userRepository.findUserByEmail(email)
      if (existingUser) {
        ApiResponseHandler.error(
          res,
          { code: 'USER_EXISTS', details: 'User already exists' },
          'User already exists',
          400
        )
        return
      }
      const passwordHash = await bcrypt.hash(password, 10)
      const user = await this.userRepository.createUser({ email, passwordHash, name: name || '' })
      ApiResponseHandler.success(res, { message: 'User created successfully', user }, 'User created successfully', 201)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { email, password, name } = req.body
      if (!id) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'User not found' }, 'User not found', 404)
        return
      }
      const user = await this.userRepository.findUserById(id)
      if (!user) {
        ApiResponseHandler.error(res, { code: 'USER_NOT_FOUND', details: 'User not found' }, 'User not found', 404)
        return
      }
      if (email) {
        user.email = email
      }
      if (password) {
        user.passwordHash = await bcrypt.hash(password, 10)
      }
      if (name) {
        user.name = name
      }
      await this.userRepository.updateUser(id, user)
      ApiResponseHandler.success(res, { message: 'User updated successfully', user }, 'User updated successfully', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      if (!id) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'User not found' }, 'User not found', 404)
        return
      }
      const user = await this.userRepository.findUserById(id)
      if (!user) {
        ApiResponseHandler.error(res, { code: 'USER_NOT_FOUND', details: 'User not found' }, 'User not found', 404)
        return
      }
      await this.userRepository.deleteUser(id)
      ApiResponseHandler.success(res, { message: 'User deleted successfully' }, 'User deleted successfully', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      if (!id) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'User not found' }, 'User not found', 404)
        return
      }
      const user = await this.userRepository.findUserById(id)
      if (!user) {
        ApiResponseHandler.error(res, { code: 'USER_NOT_FOUND', details: 'User not found' }, 'User not found', 404)
        return
      }
      ApiResponseHandler.success(res, { user }, 'User fetched successfully', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userRepository.findAllUsers()
      ApiResponseHandler.success(res, { users }, 'Users fetched successfully', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }

  getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params
      if (!email) {
        ApiResponseHandler.error(res, { code: 'BAD_REQUEST', details: 'Email is required' }, 'Email is required', 400)
        return
      }
      const user = await this.userRepository.findUserByEmail(email)
      if (!user) {
        ApiResponseHandler.error(res, { code: 'USER_NOT_FOUND', details: 'User not found' }, 'User not found', 404)
        return
      }
      ApiResponseHandler.success(res, { user }, 'User fetched successfully', 200)
    } catch (error) {
      ApiResponseHandler.error(res, { code: 'INTERNAL_SERVER_ERROR', details: error }, 'Internal server error', 500)
    }
  }
}
