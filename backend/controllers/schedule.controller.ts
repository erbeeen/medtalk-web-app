import { logError } from "../middleware/logger.js";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Schedule, {
  ScheduleType,
  ScheduleDocument,
} from "../models/schedule.model.js";
import sendJsonResponse from "../utils/httpResponder.js";

export default class ScheduleController {
  constructor() {}

  addSchedule = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Test functionality
    const schedule: ScheduleType = req.body.schedule;

    if (
      !schedule.userID ||
      !schedule.medicineName ||
      !schedule.dosageStrength ||
      !schedule.perWeekFrequency ||
      !schedule.daysPerWeek ||
      !schedule.perDayFrequency ||
      !schedule.intakeTime ||
      !schedule.startDate
    ) {
      sendJsonResponse(res, 400, "provide all required fields.");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(schedule.userID)) {
      sendJsonResponse(res, 400, "invalid userID");
      return;
    }

    try {
      const newSchedule = new Schedule(schedule);
      const result = await newSchedule.save();
      sendJsonResponse(res, 201, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }

  };

  getSchedule = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Test Functionality
    const userID = String(req.query.id);
    
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      sendJsonResponse(res, 400, "invalid user id.");
      return;
    }

    try {
      const result = Schedule.find({userID: userID});
      sendJsonResponse(res, 200, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }
  };

  // TODO: Update Schedule Route
  updateSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {};

  // TODO: Delete Schedule Route
  deleteSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {};
}
