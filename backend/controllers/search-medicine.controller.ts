import DOHMedicine, {
  DOHMedicineType,
  DOHMedicineDocument,
} from "../models/doh-medicine.model.js";
import FDAMedicine, {
  FDAMedicineType,
  FDAMedicineDocument,
} from "../models/fda-medicine.model.js";
import { Request, Response } from "express";
import sendJsonResponse from "utils/httpResponder.js";

type MedicineSearchType = {
  "Brand Name": string;
  "Generic Name": string;
};

export default class SearchMedicineController {
  constructor() {}

  searchMedicine = async (req: Request, res: Response): Promise<void> => {
    const medicineToSearch: MedicineSearchType = req.body;

    try {
      if (medicineToSearch["Brand Name"] && medicineToSearch["Generic Name"]) {
        console.log("Reached Searching both brand and generic name");

        const medicine = await FDAMedicine.findOne({
          "Brand Name": {
            $regex: medicineToSearch["Brand Name"],
            $options: "i",
          },
          "Generic Name": {
            $regex: medicineToSearch["Generic Name"],
            $option: "i",
          },
        });

        if (medicine === null) {
          res.sendStatus(404);
          return;
        }

        sendJsonResponse(res, 200, medicine);
        return;
      }

      if (medicineToSearch["Brand Name"]) {
        console.log("Reached Searching Brand Name");

        const medicine = await FDAMedicine.findOne({
          "Brand Name": {
            $regex: medicineToSearch["Brand Name"],
            $options: "i",
          },
        });

        //const medicine = await SearchMedicine.findOne({
        //  "Brand Name": medicineToSearch["Brand Name"],
        //});

        //const medicine = new SearchMedicine(medicineToSearch);

        //await medicine.save();

        //console.log(medicine);

        res.status(200).json({ success: true, data: medicine });
        return;
      } else if (medicineToSearch["Generic Name"]) {
        console.log("Reached Searching Generic Name");

        const medicineArray = await FDAMedicine.find({
          "Generic Name": {
            $regex: medicineToSearch["Generic Name"],
            $options: "i",
          },
        });

        //console.log(medicineArray);

        res.status(200).json({ success: true, data: medicineArray });
        return;
      }
    } catch (err: any) {
      console.error("searchMedicine error: ", err);
      res.status(500).json({ success: false, data: "internal server error" });
      return;
    }
  };
}
