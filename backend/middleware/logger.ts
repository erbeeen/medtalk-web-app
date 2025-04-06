import { Request, Response, NextFunction } from "express";

export default function logger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start: number = Date.now();
  res.on("finish", () => {
    let duration: number = Date.now() - start;
    let timeUnit: string = "ms";
    if (duration >= 1000) {
      duration = duration / 1000;
      timeUnit = "s";
    }
    console.log(
      `${req.protocol.toUpperCase()}${req.httpVersion} ${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage} - ${duration.toFixed(2)} ${timeUnit}`,
    );
  });
  next();
}
