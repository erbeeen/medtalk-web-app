import { Request, Response } from "express";
import FDAMedicine from "../models/fda-medicine.model.js";

export default class FDAMedicineController {
  constructor() {}

  searchMedicine = async (req: Request, res: Response): Promise<void> => {
    const medicineToSearch = req.body;

    try {
      if (medicineToSearch["Brand Name"]) {
        console.log("Reached Searching Brand Name");
        
        const medicine = await FDAMedicine.findOne({
          "Brand Name": {
            $regex: medicineToSearch["Brand Name"],
            $options: "i",
          },
        });
        //
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
