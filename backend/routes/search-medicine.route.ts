import cors from "cors";
import SearchMedicineController from "../controllers/search-medicine.controller.js";
import { Router } from "express";

const searchMedRouter: Router = Router();
const smc: SearchMedicineController =
  new SearchMedicineController();
searchMedRouter.use(cors());

searchMedRouter.get("/", smc.searchMedicine);

export default searchMedRouter;
