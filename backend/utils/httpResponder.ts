import { Response } from "express";

export default function sendResponse(res: Response, statusCode: number, data?: any) {
  let success: boolean;
  if (statusCode >= 200 && statusCode < 300) {
    success = true;
  } else {
    success = false;
  }
  if (statusCode === 500) {
    data = "internal server error";
  }
  res.status(statusCode).json({
    "success": success,
    "data": data
  });
}
