import { Router } from "express";
import cors from "cors";
import MedicineController from "../controllers/medicine.controller.js";

const medicineRouter: Router = Router();
const medicineController = new MedicineController();

medicineRouter.use(cors());

// CRUD routes
medicineRouter.post("/", medicineController.createMedicine);
medicineRouter.get("/", medicineController.getMedicines);
medicineRouter.get("/search", medicineController.searchMedicines);
medicineRouter.get("/get", medicineController.getMedicineById);
medicineRouter.put("/update", medicineController.updateMedicine);
medicineRouter.delete("/delete", medicineController.deleteMedicine);

export default medicineRouter; 