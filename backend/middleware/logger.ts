import { Request, Response, NextFunction } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverLogPath = path.join(__dirname, "..", "server.log");

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
    const time: Date = new Date();
    const timeString: string = time.toLocaleTimeString().split(" ").join("");
    const requestLog = `[${timeString}] ${req.protocol.toUpperCase()}${req.httpVersion} ${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage} - ${duration.toFixed(2)} ${timeUnit}`;
    fs.appendFile(serverLogPath, `${requestLog}\n`, (err) => {
      if (err) {
        console.error(`Error logging to log file: ${err}\n${err.stack}`);
      }
    });
    console.log(requestLog);
  });
  next();
}

export function logError(err: Error): void {
  const time: Date = new Date();
  const timeString: string = time.toLocaleTimeString().split(" ").join("");
  fs.appendFile(
    serverLogPath,
    `[${timeString}] ${err}:\n${err.stack}\n`,
    (err) => {
      if (err) console.error(`Error logging to log file: ${err}\n${err.stack}`);
    },
  );
}
