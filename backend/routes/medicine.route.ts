import { Router } from "express";
import cors from "cors";
import MedicineController from "../controllers/medicine.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";
import cookieParser from "cookie-parser";

const medicineRouter: Router = Router();
medicineRouter.use(cookieParser());
const mc = new MedicineController();
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];

if (!isProduction) {
  medicineRouter.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

// medicineRouter.use(authenticateJwt);

// CRUD routes
medicineRouter.get("/all", mc.getAllMedicines);
medicineRouter.get("/search", mc.searchMedicines);
medicineRouter.get("/get", mc.getMedicineById);
medicineRouter.put("/update", mc.updateMedicine);
medicineRouter.delete("/delete/batch", mc.deleteMedicines);
medicineRouter.delete("/delete", mc.deleteMedicine);
medicineRouter.get("/statistics", mc.getMedicineUsageStatistics);
medicineRouter.post("/", mc.createMedicine);
medicineRouter.get("/", mc.getMedicineByName);

export default medicineRouter;
