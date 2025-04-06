import { Request, Response, NextFunction } from "express";

export default function logger(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage}`);
  next();
}
