import { Request, Response, NextFunction } from 'express'

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
  console.log('checkApiKey run')
  const apiKey = req.headers['x-api-key']
  console.log('apiKey', apiKey)
  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  next()
}
