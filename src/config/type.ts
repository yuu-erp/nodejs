export interface AppConfig {
  port: number
  prefix: string
  jwtAccessSecret: string
  accessTokenExpiration: string
  jwtRefreshSecret: string
  refreshTokenExpiration: string
}
