//admin


//TODO
//port GPT in the backend 

import { Request, Response } from "express";
import Medicine, { MedicineType } from "../models/medicine.model.js";
import sendJsonResponse from "../utils/httpResponder.js";

export default class MedicineController {
  constructor() {}

  // Create a new medicine
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

  // Get all medicines with optional filtering
  getMedicines = async (req: Request, res: Response): Promise<void> => {
    try {
      const { brandName, genericName, source } = req.query;
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

  //keep; gawa ng get_medicine gamit yung genericName
  // Get a single medicine by ID
  getMedicineById = async (req: Request, res: Response): Promise<void> => {
    try {
      const medicine = await Medicine.findById(req.params.id);
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

  // Update a medicine
  updateMedicine = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedMedicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
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

  // Delete a medicine
  deleteMedicine = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedMedicine = await Medicine.findByIdAndDelete(req.params.id);
      
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
      const { brandName, genericName, source, manufacturer, classification } = req.query;
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
