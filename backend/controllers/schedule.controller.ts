import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { logError } from "../middleware/logger.js";
import Schedule, {
  ScheduleType,
  ScheduleDocument,
} from "../models/schedule.model.js";
import sendJsonResponse from "../utils/httpResponder.js";
import SystemLog from "../models/system-logs.model.js";
import User from "../models/user.model.js";

type FormattedSchedule = {
  batchId: string;
  medicineName: string;
  measurement: string;
  startDate: Date;
  endDate: Date;
  intakeTimes: string[];
  assignedBy: string;
};

export default class ScheduleController {
  constructor() {}

  // NOTE: Deprecated
  addSchedule = async (req: Request, res: Response, next: NextFunction) => {
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

  // NOTE: Adding schedule on a batch to have their own uuid for the group
  addBatchSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const schedules: Array<ScheduleType> = req.body.schedules;

      if (
        !schedules[0].userID ||
        !schedules[0].medicineName ||
        !schedules[0].measurement ||
        schedules[0].isTaken === undefined ||
        !schedules[0].date
      ) {
        sendJsonResponse(res, 400, "provide all required fields.");
        return;
      }

      const batchId = uuidv4();

      schedules.map((schedule) => { 
        if (!schedule.assignedBy) {
          schedule.assignedBy = "Self";
        }
        schedule.batchId = batchId;
      });


      const result = await Schedule.insertMany(schedules);
      sendJsonResponse(res, 201, result);

      const user = await User.findById(schedules[0].userID);
      await SystemLog.create({
        level: "info",
        source: "schedule-panel",
        category: "schedule-management",
        message: "User schedule creation successful.",
        initiated_by: req.user.username,
        data: {
          batchId: batchId,
          medicine: schedules[0].medicineName,
          target: `${user.firstName} ${user.lastName}`,
        },
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "schedule-panel",
        category: "schedule-management",
        message: "User schedule creation failed.",
        initiated_by: req.user.username,
        data: {
          error: err,
        },
      });
      next(err);
    }
  };

  getAllSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await Schedule.find();
      sendJsonResponse(res, 200, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

  getSchedule = async (req: Request, res: Response, next: NextFunction) => {
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
      const result = await Schedule.find({ userID: userID });
      sendJsonResponse(res, 200, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }
  };

  getFormattedSchedulesByID = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (req.user.role !== "super admin" && req.user.role !== "doctor") {
        res.sendStatus(409);
        return;
      }

      const userID = String(req.query.id);
      if (!userID) {
        sendJsonResponse(res, 400, "No user id provided.");
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(userID)) {
        sendJsonResponse(res, 400, "invalid user id");
        return;
      }

      const userRawSchedules = await Schedule.find({ userID: userID });

      const groupedSchedules = userRawSchedules.reduce(
        (acc, schedule) => {
          const key = schedule.batchId;

          if (!acc[key]) {
            acc[key] = [];
          }

          acc[key].push(schedule);

          return acc;
        },
        {} as Record<string, ScheduleDocument[]>,
      );

      const formattedSchedules: FormattedSchedule[] = Object.entries(
        groupedSchedules,
      ).map(([batchId, records]) => {
        let startDate = records[0].date;
        let endDate = records[0].date;
        const assignedBy = records[0].assignedBy;
        const intakeTimes = new Set<string>();

        const medicineName = records[0].medicineName;
        const measurement = records[0].measurement;

        for (const record of records) {
          const recordDate = record.date;
          const instruction = record.intakeInstruction;

          if (recordDate < startDate) {
            startDate = recordDate;
          }
          if (recordDate > endDate) {
            endDate = recordDate;
          }

          const timeMatch = instruction.match(/(\d{2}:\d{2})/);
          if (timeMatch) {
            // NOTE: Extract the 'HH:MM' part (e.g., '20:49')
            const time = timeMatch[0];

            // NOTE: Convert 24-hour time (HH:MM) to a more readable format (e.g., 8:49 pm)
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "pm" : "am";
            const displayHour = hour % 12 || 12; // Converts 0 to 12 for 12 am, and 13 to 1 for 1 pm
            const displayTime = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;

            intakeTimes.add(displayTime);
          }
        }

        return {
          batchId,
          medicineName,
          measurement,
          startDate,
          endDate,
          intakeTimes: Array.from(intakeTimes),
          assignedBy
        };
      }); 

      sendJsonResponse(res, 200, formattedSchedules);
      const user = await User.findById(userID);
      await SystemLog.create({
        level: "info",
        source: "schedule-panel",
        category: "schedule-management",
        message: "Doctor fetching user schedules successful",
        initiated_by: req.user.username,
        data: {
          "User selected": `${user.firstName} ${user.lastName}`
        },
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "schedule-panel",
        category: "schedule-management",
        message: "Doctor fetching user schedules failed",
        initiated_by: req.user.username,
        data: {
          error: err
        },
      });
      next(err);
    }
  };

  // TODO: Test functionality of updating future doses
  updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
    const scheduleID = String(req.query.id);
    const scheduleDetails: ScheduleType = req.body.schedule;
    const changeFutureDoses = Boolean(req.body.changeFutureDoses);

    if (!scheduleID) {
      sendJsonResponse(res, 400, "no schedule id provided");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(scheduleID)) {
      sendJsonResponse(res, 400, "invalid schedule id.");
      return;
    }

    try {
      let result: any;
      if (changeFutureDoses) {
        const reference = await Schedule.findById(scheduleID);
        const updateDetails = { ...scheduleDetails };
        if (updateDetails.date) {
          result = await Schedule.updateMany(
            {
              batchId: reference.batchId,
              $expr: {
                $and: [
                  { date: ["$date", reference.date] },
                  { $eq: [{ $hour: "$date" }, { $hour: reference.date }] },
                  { $eq: [{ $minute: "$date" }, { $minute: reference.date }] },
                ],
              },
            },
            {
              $set: updateDetails,
            },
            { new: true },
          );
        } else {
          result = await Schedule.updateMany(
            {
              batchId: reference.batchId,
              date: { $gte: reference.date },
            },
            {
              $set: updateDetails,
            },
            { new: true },
          );
        }
      } else {
        result = await Schedule.findByIdAndUpdate(scheduleID, scheduleDetails, {
          new: true,
        });
      }
      sendJsonResponse(res, 201, result);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

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
