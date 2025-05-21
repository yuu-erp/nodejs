import { Request, Response } from 'express'
import { CreateUserDto } from '../dtos/create-user.dto'
import { UserService } from '../services/user.service'
export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers()
    res.json(users)
  }

  createUser = async (req: Request, res: Response) => {
    const { email, name, password } = req.body as CreateUserDto
    const user = await this.userService.createUser({ email, name, password })
    res.json(user)
  }
}
