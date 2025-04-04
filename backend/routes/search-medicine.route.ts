import { Router } from "express";
import cors from "cors";
import SearchMedicineController from "../controllers/search-medicine.controller.js";

const searchMedRouter: Router = Router();
const searchMedController: SearchMedicineController =
  new SearchMedicineController();
searchMedRouter.use(cors());

searchMedRouter.get("/", searchMedController.searchMedicine);

export default searchMedRouter;
