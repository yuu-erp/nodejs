import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { appConfig } from "~/config/app.config";

const AuthMiddlerware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const token = req.header("Authorization")
        if (!token) {
          return  res.status(401).json({ message: "khoogn tìm thấy token" })
        } else {
            const checkToken = jwt.verify(token, appConfig.tokenJWT);
                (req as any).user = checkToken
                next()
        }


    } catch (error) {
        res.status(401).json({ message: "token không hợp lệ" })
    }
}
 export default  AuthMiddlerware;