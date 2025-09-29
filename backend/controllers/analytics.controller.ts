import { NextFunction, Request, Response } from "express";
import sendJsonResponse from "../utils/httpResponder.js";
import { logError } from "../middleware/logger.js";
import SearchedMedicine, {
  SearchedMedicineDocument,
} from "../models/searched-medicines.model.js";
import SystemLog from "../models/system-logs.model.js";

type MedicineCountType = {
  name: string;
  count: number;
};

export default class AnalyticsController {
  constructor() {}

  private countMedicines(data: Array<SearchedMedicineDocument>, limit: number): Array<MedicineCountType> {
    let results: MedicineCountType[] = [];
    let container: MedicineCountType[] = [];
    const medCounter = new Map<string, number>();
    data.forEach((item) => {
      const formattedName = String(
        `${item.medicine[0].toUpperCase()}${item.medicine.substring(1)}`,
      );
      medCounter.set(formattedName, (medCounter.get(formattedName) || 0) + 1);
    });
    medCounter.forEach((count, medicineName) => {
      container.push({ name: medicineName, count });
    });
    container.sort((a, b) => b.count - a.count);
    for (let i = 0; i < limit; i++) {
      if (container[i] === undefined) break;
      results[i] = container[i];
    }
    return results;
  }

  getDaily = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startDate = new Date(String(req.query.date));
      const nextDate = new Date(startDate);
      nextDate.setDate(startDate.getDate() + 1);

      const data = await SearchedMedicine.find({
        dateSearched: {
          $gte: startDate,
          $lt: nextDate,
        },
      });

      const results = this.countMedicines(data, 3);
      sendJsonResponse(res, 200, results);
    } catch (err) {
      console.error("get analytics by day err:");
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "analytics",
        category: "analytics",
        message: "Get analytics by day failed.",
        data: { ...err },
      });
      next(err);
    }
  };

  getWeekly = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const endDate = new Date(String(req.query.date));
      const startDate = new Date(endDate);
      const day = endDate.getDay();
      let daysToAdd = 0;
      if (day !== 0) {
        daysToAdd = 6 - day;
      }

      startDate.setDate(startDate.getDate() - day);
      endDate.setDate(endDate.getDate() + daysToAdd);
      if (startDate.getTime() === endDate.getTime()) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const data = await SearchedMedicine.find({
        dateSearched: {
          $gte: startDate,
          $lte: endDate,
        },
      });
      const result = this.countMedicines(data, 4);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      console.error("Get analytics by week error:");
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "analytics",
        category: "analytics",
        message: "Get analytics by week failed.",
        data: { ...err },
      });
      next(err);
    }
  };

  getMonthly = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const startDate = new Date(String(req.query.date));
      const endDate = new Date(startDate);
      const isLeap = new Date(startDate.getFullYear(), 1, 29).getDate() === 29;
      let daysToAdd;

      switch (endDate.getMonth()) {
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
          daysToAdd = 31;
          break;

        case 3:
        case 5:
        case 8:
        case 10:
          daysToAdd = 30;
          break;

        case 1:
          daysToAdd = isLeap ? 29 : 28;
          break;
      }

      endDate.setDate(endDate.getDate() + daysToAdd);
      
      
      const data = await SearchedMedicine.find({
        dateSearched: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      const result = this.countMedicines(data, 6);
      sendJsonResponse(res, 200, result);
    } catch (err) {
      console.error("Get analytics by month err:");
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "analytics",
        category: "analytics",
        message: "Get analytics by month failed.",
        data: {  ...err },
      });
      next(err);
    }
  };
}
