import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { RegisterDto } from '~/dtos/register.dto'
import { appConfig } from '../config/app.config'
import { LoginDto } from '../dtos/login.dto'
import { RefreshtokenPayloadDto } from '../dtos/refreshtoken.dto'
import { isEmail } from '../untils/email.validate'
import { canAttemptLogin, recordFailedAttempt, resetAttempts } from '../untils/loginAttempts'
import { PrismaService } from './prisma.service'
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(registerdto: RegisterDto): Promise<User> {
    if (!registerdto.email) throw new Error('vui lòng nhập email')
    if (!isEmail(registerdto.email)) throw new Error('email không đúng định dạng')
    if (!registerdto.name) throw new Error('vui lòng nhập name')
    if (!registerdto.password) throw new Error('vui lòng nhập password')
    const checkMail = await this.prismaService.user.findUnique({ where: { email: registerdto.email } })
    if (checkMail) throw new Error('đã tồn tại email này')
    const hashPass = await bcrypt.hash(registerdto.password, 10)
    const user = await this.prismaService.user.create({
      data: {
        email: registerdto.email,
        password: hashPass,
        name: registerdto.name
      }
    })
    return user
  }
  async login(LoginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    if (!LoginDto.email) throw new Error('vui lòng nhập email')
    if (!LoginDto.password) throw new Error('vui lòng nhập password')
    if (!canAttemptLogin(LoginDto.email)) throw new Error('Tài khoản bị khóa tạm thời. Thử lại sau 15 phút.')
    const user = await this.prismaService.user.findUnique({ where: { email: LoginDto.email } })
    if (!user) throw new Error('không tồn tại user email này')
    const pwdMatch = await bcrypt.compare(LoginDto.password, user.password)
    if (!pwdMatch) {
      recordFailedAttempt(LoginDto.email)
      throw new Error('sai mật khẩu')
    }
    resetAttempts(LoginDto.email)
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, appConfig.tokenJWT, {
      expiresIn: '1h'
    })
    const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, appConfig.refreshJWT, {
      expiresIn: '7d'
    })
    user.refreshtokenDB = refreshToken
    await this.prismaService.user.update({
      where: { id: user.id },

      data: {
        refreshtokenDB: refreshToken
      }
    })
    return { accessToken, refreshToken }
  }
  async refrestoken(payload: RefreshtokenPayloadDto): Promise<{ accessToken: string; refreshToken: string }> {
    if (!payload.id) throw new Error('User Not found!')
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.id }
    })
    if (!user) throw new Error('không tìm thấy user')
    const newAccessToken = jwt.sign({ id: user.id, email: user.email }, appConfig.tokenJWT, {
      expiresIn: '1h'
    })
    const newRefreshToken = jwt.sign({ id: user.id, email: user.email }, appConfig.refreshJWT, {
      expiresIn: '7d'
    })
    user.refreshtokenDB = newRefreshToken
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        refreshtokenDB: newRefreshToken
      }
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
  async logout(refreshDto: any) {
    if (!refreshDto.refreshToken) throw new Error('vui lòng điền refesh')
    const decoded: any = jwt.verify(refreshDto.refreshToken, appConfig.refreshJWT)
    if (!decoded) throw new Error('sai token hoặc token hết hạn')
    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.id }
    })
    if (!user) throw new Error('không tìm thấy user')
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        refreshtokenDB: null
      }
    })
  }
}
