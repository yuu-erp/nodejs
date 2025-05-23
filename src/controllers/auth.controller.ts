import { AuthService } from '~/services/auth.service'
import { Request, Response } from 'express'
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  register = async (req: Request, res: Response) => {

    try {
      const { email, password, name } = req.body
      const sendData = await this.authService.register({ email, password, name })
      res.status(201).json(sendData)
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message })
    }
  }
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
      const sendLogin = await this.authService.login({email,password})
      res.status(201).json(sendLogin)
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message })
    }
  }
}
