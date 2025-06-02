import mongoose from "mongoose";

export type MedicineType = {
  "Level 1"?: string;
  "Level 2"?: string;
  "Level 3"?: string;
  "Level 4"?: string;
  Molecule: string;
  Route?: string;
  "Technical Specification"?: string;
};

export type MedicineDocument = MedicineType & mongoose.Document;

const medicineSchema = new mongoose.Schema({
  "Level 1": String,
  "Level 2": String,
  "Level 3": String,
  "Level 4": String,
  Molecule: {
    type: String,
    required: true,
  },
  Route: String,
  "Technical Specification": String,
  "ATC CODE": String,
});

const Medicine = mongoose.model(
  "doh_medicine_database",
  medicineSchema,
  "doh_medicine_database",
);

export default Medicine;
