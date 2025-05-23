import { Config } from './config.type'
import { config } from 'dotenv'
config()

export const appConfig: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  tokenJWT: process.env.TOKEN_SECRET || "",
  refreshJWT:process.env.TOKEN_REFRESH || ""
}
