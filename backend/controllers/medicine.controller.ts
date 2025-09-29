import { NextFunction, Request, Response } from "express";
import Medicine, { MedicineType } from "../models/medicine.model.js";
import sendJsonResponse from "../utils/httpResponder.js";
import { logError } from "../middleware/logger.js";
import SearchedMedicine from "../models/searched-medicines.model.js";
import SystemLog from "../models/system-logs.model.js";
import mongoose from "mongoose";

export default class MedicineController {
  constructor() {}

  createMedicine = async (req: Request, res: Response): Promise<void> => {
    if (req.user.role !== "super admin" && req.user.role !== "doctor") {
      res.sendStatus(403);
      return;
    }

    try {
      const medicineData: MedicineType = req.body;
      if (
        !medicineData["Level 1"] ||
        !medicineData["Level 2"] ||
        !medicineData["Level 3"] ||
        !medicineData.Molecule ||
        !medicineData["Technical Specifications"] ||
        !medicineData["ATC Code"]
      ) {
        sendJsonResponse(res, 400, "Provide required fields");
        return;
      }
      const newMedicine = new Medicine(medicineData);
      const savedMedicine = await newMedicine.save();
      sendJsonResponse(res, 201, savedMedicine);

      await SystemLog.create({
        level: "info",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine creation successful.",
        initiated_by: req.user.username,
        data: {
          _id: savedMedicine._id,
          molecule: savedMedicine.Molecule,
        },
      });
    } catch (err) {
      console.error("createMedicine error:", err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine creation failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
    }
  };

  getAllMedicines = async (req: Request, res: Response) => {
    if (req.user.role !== "super admin" && req.user.role !== "doctor") {
      res.sendStatus(403);
      return;
    }

    try {
      const medicines = await Medicine.find();
      sendJsonResponse(res, 200, medicines);
    } catch (err) {
      sendJsonResponse(res, 500, "cannot get all medicine");
    } finally {
      return;
    }
  };

  // Get all medicines with optional filtering
  getMedicinesWithFilter = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (req.user.role !== "super admin" && req.user.role !== "doctor") {
      res.sendStatus(403);
      return;
    }

    try {
      const { genericName, source } = req.query;
      const query: any = {};

      // if (brandName) {
      //   query.brandName = { $regex: brandName, $options: "i" };
      // }
      if (genericName) {
        query.genericName = { $regex: genericName, $options: "i" };
      }
      if (source) {
        query.source = source;
      }

      const medicines = await Medicine.find(query);
      sendJsonResponse(res, 200, medicines);
    } catch (err) {
      console.error("getMedicines error:", err);
      sendJsonResponse(res, 500, "Error fetching medicines");
    }
  };

  getMedicineById = async (req: Request, res: Response): Promise<void> => {
    try {
      const medicine = await Medicine.findById(req.query.id);
      if (!medicine) {
        sendJsonResponse(res, 404, "Medicine not found");
        return;
      }
      sendJsonResponse(res, 200, medicine);
    } catch (err) {
      console.error("getMedicineById error:", err);
      sendJsonResponse(res, 500, "Error fetching medicine");
    }
  };

  getMedicineByName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const genericName = req.query.genericName;

    if (genericName === undefined) {
      sendJsonResponse(res, 400, "provide generic name");
      return;
    }

    try {
      const medicine = await Medicine.findOne({ Molecule: genericName });
      const saveSearch = new SearchedMedicine({
        medicine: genericName,
      });
      saveSearch.save();
      sendJsonResponse(res, 200, medicine);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

  updateMedicine = async (req: Request, res: Response): Promise<void> => {
    if (req.user.role !== "super admin" && req.user.role !== "doctor") {
      res.sendStatus(403);
      return;
    }

    try {
      const updatedMedicine = await Medicine.findByIdAndUpdate(
        req.query.id,
        req.body,
        { new: true, runValidators: true },
      );

      if (!updatedMedicine) {
        sendJsonResponse(res, 404, "Medicine not found");
        return;
      }

      sendJsonResponse(res, 200, updatedMedicine);

      await SystemLog.create({
        level: "info",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine information update successful.",
        initiated_by: req.user.username,
        data: { ...updatedMedicine },
      });
    } catch (err) {
      console.error("updateMedicine error:", err);
      sendJsonResponse(res, 500, "Error updating medicine");

      await SystemLog.create({
        level: "error",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine creation failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
    }
  };

  deleteMedicine = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (req.user.role !== "super admin" && req.user.role !== "doctor") {
      res.sendStatus(403);
      return;
    }

    if (req.query.id === undefined) {
      sendJsonResponse(res, 400, "No id provided");
      return;
    }

    try {
      const deletedMedicine = await Medicine.findByIdAndDelete(req.query.id);

      if (!deletedMedicine) {
        sendJsonResponse(res, 404, "Medicine not found");
        return;
      }

      sendJsonResponse(res, 200, deletedMedicine);
      await SystemLog.create({
        level: "info",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine deletion successful.",
        initiated_by: req.user.username,
        data: { ...deletedMedicine },
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
      await SystemLog.create({
        level: "error",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine deletion successful.",
        initiated_by: req.user.username,
        data: { ...err },
      });
    }
  };

  deleteMedicines = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "super admin" && req.user.role !== "doctor") {
      res.sendStatus(403);
      return;
    }

    const idList = req.body;

    if (!idList || !Array.isArray(idList) || idList.length === 0) {
      sendJsonResponse(res, 400, "No IDs provided");
      return;
    }

    try {
      const objectIds = idList.map((id) => new mongoose.Types.ObjectId(id));
      const result = await Medicine.deleteMany({ _id: { $in: objectIds } });
      sendJsonResponse(res, 200, result);

      await SystemLog.create({
        level: "info",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine batch deletion successful.",
        initiated_by: req.user.username,
        data: { ...result },
      });

    } catch (err) {
      console.error(`${this.deleteMedicines.name} error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "medicine-panel",
        category: "medicine-management",
        message: "Medicine batch deletion failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
      next(err);
    }
  };

  // Search medicines with advanced filtering
  searchMedicines = async (req: Request, res: Response): Promise<void> => {
    try {
      const { brandName, genericName, source, manufacturer, classification } =
        req.query;
      const query: any = {};

      if (brandName) {
        query.brandName = { $regex: brandName, $options: "i" };
      }
      if (genericName) {
        query.genericName = { $regex: genericName, $options: "i" };
      }
      if (source) {
        query.source = source;
      }
      if (manufacturer) {
        query.manufacturer = { $regex: manufacturer, $options: "i" };
      }
      if (classification) {
        query.classification = { $regex: classification, $options: "i" };
      }

      const medicines = await Medicine.find(query);
      sendJsonResponse(res, 200, medicines);
    } catch (err) {
      console.error("searchMedicines error:", err);
      sendJsonResponse(res, 500, "Error searching medicines");
    }
  };
}
