import { RegisterDto } from '~/dtos/register.dto';
import { PrismaService } from './prisma.service'
import { isEmail } from "../untils/email.validate"
import bcrypt from "bcrypt"
import { canAttemptLogin, recordFailedAttempt, resetAttempts } from '../untils/loginAttempts';
import jwt from 'jsonwebtoken';
import { LoginDto } from '../dtos/login.dto';
import { appConfig } from "../config/app.config"
import { User } from "@prisma/client"
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { }


  async register(registerdto: RegisterDto): Promise<User> {
    if (!registerdto.email) throw new Error("vui lòng nhập email")
    if (!isEmail(registerdto.email)) throw new Error("email không đúng định dạng")
    if (!registerdto.name) throw new Error("vui lòng nhập name")
    if (!registerdto.password) throw new Error("vui lòng nhập password")
    const checkMail = await this.prismaService.user.findUnique({ where: { email: registerdto.email } })
    if (checkMail) throw new Error("đã tồn tại email này")
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
    if (!LoginDto.email) throw new Error("vui lòng nhập email")
    if (!LoginDto.password) throw new Error('vui lòng nhập password');
    if (!canAttemptLogin(LoginDto.email)) throw new Error('Tài khoản bị khóa tạm thời. Thử lại sau 15 phút.')
    const user = await this.prismaService.user.findUnique({ where: { email: LoginDto.email } })
    if (!user) throw new Error('không tồn tại user email này')
    const pwdMatch = await bcrypt.compare(LoginDto.password, user.password)
    if (!pwdMatch) {
      recordFailedAttempt(LoginDto.email)
      throw new Error('sai mật khẩu');
    }
    resetAttempts(LoginDto.email)
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_REFRESH as string,
      {
        expiresIn: "1h"
      }
    );
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, appConfig.refreshJWT,
      {
        expiresIn: "7d"
      }
    );
    user.refreshtokenDB = refreshToken
    const saveUser = await this.prismaService.user.update({
      where: {id:user.id},
      
      data: {
        refreshtokenDB: refreshToken
      }
    });
    return {accessToken,refreshToken}
  }
}
