import { NextFunction, Request, Response } from "express";
import SystemLog from "../models/system-logs.model.js";
import { logError } from "../middleware/logger.js";
import sendJsonResponse from "../utils/httpResponder.js";
export default class SystemLogsController {
  constructor() {}

  getLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await SystemLog.find().sort({ timestamp: -1 });
      sendJsonResponse(res, 200, result);
    } catch (err) {
      console.error("Get system logs error");
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
      await SystemLog.create({
        level: "error",
        source: "system-logs",
        category: "system-logs",
        message: "Failed to fetch system logs.",
        data: {
          error: err,
        },
      });
    }
  };
}
