import { UserRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

export class AdminUserController {
  constructor(private readonly userRepository: UserRepository) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const userReq = req.user
      if (userReq?.role !== 'ADMIN') {
        res.status(403).json({ message: 'Forbidden' })
        return
      }
      const { email, name, password, role } = req.body
      const passwordHash = await bcrypt.hash(password, 10)
      const user = await this.userRepository.createUser({ email, name, passwordHash, role })
      res.status(201).json({ message: 'User created successfully', user })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }

  updateUser = async (req: Request, res: Response) => {}
  
  delete = () => {}

  getUsers = async (req: Request, res: Response) => {}

  getUserById = async (req: Request, res: Response) => {}
}
