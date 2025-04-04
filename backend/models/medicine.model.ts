import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  genericName: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
});

const Medicine = mongoose.model("medicine", medicineSchema);
export default Medicine;
