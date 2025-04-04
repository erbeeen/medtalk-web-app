import { Request, Response } from "express";
import Medicine from "models/medicine.model.js";

export default class MedicineController {
  constructor() {}

  searchMedicine = (req: Request, res: Response): Promise<void> => {
    const medicineToSearch = req.body;
    return;
  };
}
