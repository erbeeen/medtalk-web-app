import { Router } from "express";
import cors from "cors";
import MedicineController from "../controllers/medicine.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";
import cookieParser from "cookie-parser";

const medicineRouter: Router = Router();
medicineRouter.use(cookieParser());
const medicineController = new MedicineController();

medicineRouter.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// CRUD routes
medicineRouter.get("/all", authenticateJwt, medicineController.getAllMedicines);
medicineRouter.get("/search", medicineController.searchMedicines);
medicineRouter.get("/get", medicineController.getMedicineById);
medicineRouter.put("/update", medicineController.updateMedicine);
medicineRouter.delete("/delete", medicineController.deleteMedicine);
medicineRouter.post("/", medicineController.createMedicine);
medicineRouter.get("/", medicineController.getMedicineByName);

export default medicineRouter; 
