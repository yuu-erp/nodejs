import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { UserRepository } from '../repositories/user.repository'
import { isAdmined } from '../utils/isAdmin'
export class AdminUserController {
  constructor(private readonly userRepository: UserRepository) {}

  createUser = async (req: Request, res: Response) => {
    try {
      if (!req.user || !isAdmined(req.user)) {
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

  updateUser = async (req: Request, res: Response) => {
    try {
      if (!req.user || !isAdmined(req.user)) {
        res.status(403).json({ message: 'Forbidden' })
        return
      }
      const inf = req.body
      if (!inf) throw new Error('vui lòng điền thông tin')
      const userId = await this.userRepository.findUserById(req.user.id)
      if (!userId) throw new Error('không tìm thấy user')
      const updateUser = await this.userRepository.updateUser(userId.id, inf)
      res.status(201).json({ message: 'User updated successfully', updateUser })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }

  deleteUser = async (req: Request, res: Response) => {
    try {
      const idUser = req.params.id
      if (!idUser) throw new Error('Cần truyền param id')
      const user = await this.userRepository.findUserById(idUser)
      if (!user) throw new Error('không tìm thấy hoặc đã xóa')
      await this.userRepository.deleteUser(idUser)
      res.status(200).json({ message: 'Xóa người dùng thành công' })
      return
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }

  getUsers = async (req: Request, res: Response) => {
    await this.userRepository.findAllUsers()
    return
  }

  getUserById = async (req: Request, res: Response) => {
    try {
      const idUser = req.user?.id
      if (!idUser) throw new Error('Unauthorized')
      const user = await this.userRepository.findUserById(idUser)
      if (!user) throw new Error('không tìm thấy hoặc đã xóa')
      res.status(200).json({ message: 'Lấy người dùng thành công', data: user })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
      return
    }
  }
}
