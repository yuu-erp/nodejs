import { AuthService } from '~/services/auth.service'
import { Request, Response } from 'express'
import { canAttemptLogin, recordFailedAttempt } from '../untils/loginAttempts'
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
 refreshtoken = async(req: Request, res: Response)=>{
  try {
      const sendRefresh = await this.authService.refrestoken(req.body)
      res.status(201).json(sendRefresh)
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message })
    }

 }
 logout = async(req: Request, res: Response)=>{
  try {
      const sendLogout = await this.authService.logout(req.body)
      res.status(201).json(sendLogout)
    } catch (error: unknown) {
      res.status(500).json({ message: (error as Error).message })
    }
 }
  
}
