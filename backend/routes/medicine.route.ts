import { Router } from "express";
import cors from "cors";
import MedicineController from "../controllers/medicine.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";
import cookieParser from "cookie-parser";

const medicineRouter: Router = Router();
medicineRouter.use(cookieParser());
const medicineController = new MedicineController();
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

// CRUD routes
medicineRouter.get("/all", authenticateJwt, medicineController.getAllMedicines);
medicineRouter.get(
  "/search",
  authenticateJwt,
  medicineController.searchMedicines,
);
medicineRouter.get("/get", authenticateJwt, medicineController.getMedicineById);
medicineRouter.put(
  "/update",
  authenticateJwt,
  medicineController.updateMedicine,
);
medicineRouter.delete(
  "/delete/batch",
  authenticateJwt,
  medicineController.deleteMedicines,
);
medicineRouter.delete(
  "/delete",
  authenticateJwt,
  medicineController.deleteMedicine,
);
medicineRouter.post("/", authenticateJwt, medicineController.createMedicine);
medicineRouter.get("/", authenticateJwt, medicineController.getMedicineByName);

export default medicineRouter;
