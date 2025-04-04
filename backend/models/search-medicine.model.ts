import mongoose from "mongoose";

const searchMedicine = new mongoose.Schema({
  "Product Information": {
    type: String,
    required: false,
  },
  "Registration Number": {
    type: String,
    required: false,
  },
  "Generic Name": {
    type: String,
    required: false,
  },
  "Brand Name": {
    type: String,
    required: true,
  },
  "Dosage Strength": {
    type: String,
    required: false,
  },
  "Dosage Form": {
    type: String,
    required: false,
  },
  Classification: {
    type: String,
    required: false,
  },
  "Pharmacologic Category": {
    type: String,
    required: false,
  },
  Packaging: {
    type: String,
    required: false,
  },
  Manufacturer: {
    type: String,
    required: false,
  },
  "Country of Origin": {
    type: String,
    required: false,
  },
  Trader: {
    type: String,
    required: false,
  },
  Importer: {
    type: String,
    required: false,
  },
  Distributor: {
    type: String,
    required: false,
  },
  "Expiry Date": {
    type: String,
    required: false,
  },
});

const SearchMedicine = mongoose.model("medicine_database", searchMedicine, "medicine_database");
export default SearchMedicine;
