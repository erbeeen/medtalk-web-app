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
    const schedule: ScheduleType = req.body;

    if (
      !schedule.userID ||
      !schedule.medicineName ||
      !schedule.measurement ||
      schedule.isTaken === undefined ||
      !schedule.date
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

  getAllSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Schedule.find();
      sendJsonResponse(res, 200, result);
    } catch (err) {
      sendJsonResponse(res, 500);
    }
  }

  getSchedule = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Test Functionality
    const scheduleID = String(req.query.id);

    if (!mongoose.Types.ObjectId.isValid(scheduleID)) {
      sendJsonResponse(res, 400, "invalid schedule id.");
      return;
    }

    try {
      const result = await Schedule.findById(scheduleID);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }
  };

  getSchedulesByUserID = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userID = String(req.query.id);
    if (!userID) {
      sendJsonResponse(res, 400, "no user id provided");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      sendJsonResponse(res, 400, "invalid user id");
      return;
    }

    try {
      const result = await Schedule.find({ userID: userID } );
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
  updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    // NOTE: This implementation uses the id of a schedule
    // changing future doses is not yet available
    const scheduleID = String(req.query.id);
    const scheduleDetails: ScheduleType = req.body;

    if (!scheduleID) {
      sendJsonResponse(res, 400, "no schedule id provided");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(scheduleID)) {
      sendJsonResponse(res, 400, "invalid schedule id.");
      return;
    }

    if (
      !scheduleDetails.userID ||
      !scheduleDetails.medicineName ||
      !scheduleDetails.measurement ||
      scheduleDetails.isTaken === undefined ||
      !scheduleDetails.date
    ) {
      sendJsonResponse(res, 400, "provide all required fields.");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(scheduleDetails.userID)) {
      sendJsonResponse(res, 400, "invalid user id.");
      return;
    }

    try {
      const result: ScheduleDocument = await Schedule.findByIdAndUpdate(
        scheduleID,
        scheduleDetails,
        { new: true },
      );
      sendJsonResponse(res, 201, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }
  };

  // TODO: Delete Schedule Route
  deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
    // NOTE: This implementation uses the id of a schedule
    // deleting future schedules is not yet available

    if (req.query.id === undefined) {
      sendJsonResponse(res, 400, "No ID provided");
    }

    const scheduleID = String(req.query.id);

    if (!mongoose.Types.ObjectId.isValid(scheduleID)) {
      sendJsonResponse(res, 400, "invalid schedule id.");
      return;
    }

    try {
      const result: ScheduleDocument =
        await Schedule.findByIdAndDelete(scheduleID);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }
  };

  deleteSchedules = async (req: Request, res: Response, next: NextFunction) => {
    const idList = req.body;

    if (!idList || !Array.isArray(idList) || idList.length === 0) {
      sendJsonResponse(res, 400, "No IDs provided");
      return;
    }

    try {
      const objectIds = idList.map((id) => new mongoose.Types.ObjectId(id));
      const result = await Schedule.deleteMany({ _id: { $in: objectIds } });
      sendJsonResponse(res, 200, result);
    } catch (err) {
      console.error(`${this.deleteSchedules.name} error`);
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };
}
