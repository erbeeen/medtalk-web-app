//admin

//TODO
//port GPT in the backend

import { NextFunction, Request, Response } from "express";
import Medicine, { MedicineType } from "../models/medicine.model.js";
import sendJsonResponse from "../utils/httpResponder.js";
import { logError } from "middleware/logger.js";
import SearchedMedicine from "models/searched-medicines.model.js";

export default class MedicineController {
  constructor() {}

  createMedicine = async (req: Request, res: Response): Promise<void> => {
    try {
      const medicineData: MedicineType = req.body;
      const newMedicine = new Medicine(medicineData);
      const savedMedicine = await newMedicine.save();
      sendJsonResponse(res, 201, savedMedicine);
    } catch (err) {
      console.error("createMedicine error:", err);
      sendJsonResponse(res, 500, "Error creating medicine");
    }
  };

  getAllMedicines = async (_req: Request, res: Response) => {
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
    const genericName = req.body.genericName;

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

  deleteMedicine = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedMedicine = await Medicine.findByIdAndDelete(req.query.id);

      if (!deletedMedicine) {
        sendJsonResponse(res, 404, "Medicine not found");
        return;
      }

      sendJsonResponse(res, 200, { message: "Medicine deleted successfully" });
    } catch (err) {
      console.error("deleteMedicine error:", err);
      sendJsonResponse(res, 500, "Error deleting medicine");
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
