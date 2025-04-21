import cors from "cors";
import FDAMedicineController from "../controllers/fda-medicine.controller.js";
import { Router } from "express";

const fdaMedRouter: Router = Router();
const fdaMedController: FDAMedicineController =
  new FDAMedicineController();
fdaMedRouter.use(cors());

fdaMedRouter.get("/", fdaMedController.searchMedicine);

export default fdaMedRouter;
