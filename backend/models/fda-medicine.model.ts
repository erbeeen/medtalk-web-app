import mongoose from "mongoose";

export type FDAMedicineType = {
  "Product Information"?: string;
  "Registration Number"?: string;
  "Generic Name": string;
  "Brand Name": string;
  "Dosage Strength"?: string;
  "Dosage Form"?: string;
  Classification?: string;
  "Pharmacologic Category"?: string;
  Packaging?: string;
  Manufacturer?: string;
  "Country of Origin"?: string;
  Trader?: string;
  Imorter?: string;
  Distributor?: string;
  "Expiry Date"?: string; // TODO: Convert into date type
};

export type FDAMedicineDocument = FDAMedicineType & mongoose.Document;

const fdaMedicineSchema = new mongoose.Schema({
  "Product Information": String,
  "Registration Number": String,
  "Generic Name": {
    type: String,
    required: true,
  },
  "Brand Name": {
    type: String,
    required: true,
  },
  "Dosage Strength": String,
  "Dosage Form": String,
  Classification: String,
  "Pharmacologic Category": String,
  Packaging: String,
  Manufacturer: String,
  "Country of Origin": String,
  Trader: String,
  Importer: String,
  Distributor: String,
  "Expiry Date": String, // TODO: Convert into date type
});

const FDAMedicine = mongoose.model(
  "fda_medicine_database",
  fdaMedicineSchema,
  "fda_medicine_database",
);
export default FDAMedicine;
