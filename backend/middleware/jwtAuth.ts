import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logError } from "./logger.js";

declare module "express" {
  interface Request {
    user?: string | jwt.JwtPayload;
  }
}

export default function authenticateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  

  if (token === undefined) {
    console.log("reached token === undefined");
    
    if (req.originalUrl == "/api/users/login" || req.originalUrl == "/api/users/register") {
      console.log("reached req.originalUrl = /login");
      
      next();
    } else {
      res.sendStatus(401);
      return;
    }
  } else {
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, user) => {
      if (err) {
        logError(err);
        res.status(403);
        return;
      } else {
        req.user = user;
        next();
      }
    });
  }
}
