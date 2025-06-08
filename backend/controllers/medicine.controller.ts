import { NextFunction, Request, Response } from "express";
import Medicine, { MedicineType } from "../models/medicine.model.js";
import sendJsonResponse from "../utils/httpResponder.js";
import { logError } from "../middleware/logger.js";
import SearchedMedicine from "../models/searched-medicines.model.js";
import mongoose from "mongoose";

export default class MedicineController {
  constructor() {}

  createMedicine = async (req: Request, res: Response): Promise<void> => {
    if (req.user.role !== "super admin" && req.user.role !== "admin") {
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
    } catch (err) {
      console.error("createMedicine error:", err);
      sendJsonResponse(res, 500);
    }
  };

  getAllMedicines = async (req: Request, res: Response) => {
    if (req.user.role !== "super admin" && req.user.role !== "admin") {
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
    if (req.user.role !== "super admin" && req.user.role !== "admin") {
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
    if (req.user.role !== "super admin" && req.user.role !== "admin") {
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
    } catch (err) {
      console.error("updateMedicine error:", err);
      sendJsonResponse(res, 500, "Error updating medicine");
    }
  };

  deleteMedicine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user.role !== "super admin" && req.user.role !== "admin") {
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
      return;
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

  deleteMedicines = async (req: Request, res: Response, next: NextFunction) => {
    const idList = req.body;

    if (!idList || !Array.isArray(idList) || idList.length === 0) {
      sendJsonResponse(res, 400, "No IDs provided");
      return;
    }

    try {
      const objectIds = idList.map((id) => new mongoose.Types.ObjectId(id));
      const result = await Medicine.deleteMany({ _id: { $in: objectIds } });
      sendJsonResponse(res, 200, result);
    } catch (err) {
      console.error(`${this.deleteMedicines.name} error`);
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  }

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
