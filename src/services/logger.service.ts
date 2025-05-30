import pino, { Logger as PinoLogger } from 'pino'
import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'public', 'logs')

// Đảm bảo thư mục log tồn tại
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

export class LoggerService {
  private readonly logger: PinoLogger

  constructor(context?: string) {
    this.logger = pino({
      level: 'info',
      transport: {
        targets: [
          {
            target: 'pino/file',
            options: {
              destination: path.join(LOG_DIR, 'info.log')
            },
            level: 'info'
          },
          {
            target: 'pino/file',
            options: {
              destination: path.join(LOG_DIR, 'error.log')
            },
            level: 'error'
          }
        ]
      }
    })

    if (context) {
      this.logger = this.logger.child({ context })
    }
  }

  info(message: string, payload?: unknown) {
    this.logger.info(payload ?? {}, message)
  }

  warn(message: string, payload?: unknown) {
    this.logger.warn(payload ?? {}, message)
  }

  error(message: string, payload?: unknown) {
    this.logger.error(payload ?? {}, message)
  }

  debug(message: string, payload?: unknown) {
    this.logger.debug(payload ?? {}, message)
  }

  trace(message: string, payload?: unknown) {
    this.logger.trace(payload ?? {}, message)
  }
}
