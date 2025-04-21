import Medicine from "models/medicine.model.js";
import { Request, Response } from "express";

export default class MedicineController {
  constructor() {}

  searchMedicine = (req: Request, res: Response): Promise<void> => {
    const medicineToSearch = req.body;
    return;
  };
}
