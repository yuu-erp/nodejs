import { RegisterDto } from '~/dtos/register.dto';
import { PrismaService } from './prisma.service'
import { isEmail } from "../untils/email.validate"
import bcrypt from "bcrypt"
import { canAttemptLogin, recordFailedAttempt, resetAttempts } from '~/untils/loginAttempts';
import jwt  from 'jsonwebtoken';
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { }


  async register(registerdto: RegisterDto): Promise<void> {
    if (!registerdto.email) throw new Error("vui lòng nhập email")
    if (!isEmail(registerdto.email)) throw new Error("email không đúng định dạng")
    if (!registerdto.name) throw new Error("vui lòng nhập name")
    if (!registerdto.password) throw new Error("vui lòng nhập password")
    const checkMail = await this.prismaService.user.findUnique({ where: { email: registerdto.email } })
    if (checkMail) throw new Error("đã tồn tại email này")
    const hashPass = await bcrypt.hash(registerdto.password, 10)
    const user = await this.prismaService.user.create({ data: { email: registerdto.email, password: hashPass, name: registerdto.name } })
    console.log("đki thành công")
  }
  async login(registerdto: RegisterDto): Promise<void> {
    if (!registerdto.email) throw new Error("vui lòng nhập email")
    if (!registerdto.password) throw new Error('vui lòng nhập password');
    if (!canAttemptLogin(registerdto.email)) throw new Error('Tài khoản bị khóa tạm thời. Thử lại sau 15 phút.')
    const user = await this.prismaService.user.findUnique({ where: { email: registerdto.email } })
    if (!user) throw new Error('không tồn tại user email này')
    const pwdMatch = await bcrypt.compare(registerdto.password, user.password)
    if (!pwdMatch) {
      recordFailedAttempt(registerdto.email)
      throw new Error('sai mật khẩu');
    }
    resetAttempts(registerdto.email)
    const accessToken = jwt.sign
  }
}
