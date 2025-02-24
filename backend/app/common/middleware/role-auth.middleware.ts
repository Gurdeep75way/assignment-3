import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import process from "process";
import { type IUser } from "../../user/user.dto";
interface AuthRequest extends Request {
  user?: any
}

export const roleAuth = ( 
  publicRoutes: string[] = []
) =>
  expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (publicRoutes.includes(req.path)) {
      return next();
    }
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw createHttpError(401, { message: "Unauthorized: No token provided" });
    }

    try {
      const decodedUser = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as IUser;
      req.user = decodedUser;

      next();
    } catch (error) {
      throw createHttpError(401, { message: "Invalid or expired token" });
    }
  });


export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    // console.log("Hello ");
    if (!authorization) {
      res.status(401).send({ message: "No token found" })
    }
    else {
      const token = authorization?.split(' ')[1];
      const secretkey = process.env.JWT_SECRET as string;
      const decode = jwt.verify(token, secretkey);
      if (!decode) {
        res.status(401).send({ message: "Error occurred" })
      }
      req.user = decode;
      console.log(1);
      next();
    }
  } catch (error) {
    next(createHttpError(401, "Unauthorized: Invalid or expired token"));
  }
};