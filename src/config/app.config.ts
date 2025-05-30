import { AppConfig } from './type'

export const appConfig: AppConfig = {
  port: Number(process.env.PORT) || 2023,
  prefix: process.env.PREFIX || '/api',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d'
}
