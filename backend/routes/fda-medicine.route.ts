import { Router } from "express";
import cors from "cors";
import FDAMedicineController from "../controllers/fda-medicine.controller.js";

const fdaMedRouter: Router = Router();
const fdaMedController: FDAMedicineController =
  new FDAMedicineController();
fdaMedRouter.use(cors());

fdaMedRouter.get("/", fdaMedController.searchMedicine);

export default fdaMedRouter;
