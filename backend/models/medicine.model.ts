import mongoose from "mongoose";

export type MedicineType = {
  brandName: string;
  genericName: string;
  dosageStrength?: string;
  dosageForm?: string;
  classification?: string;
  pharmacologicCategory?: string;
  packaging?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  trader?: string;
  importer?: string;
  distributor?: string;
  expiryDate?: Date;
  registrationNumber?: string;
  productInformation?: string;
  confidence?: number;
  source: string;
};

export type MedicineDocument = MedicineType & mongoose.Document;

const medicineSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    index: true
  },
  genericName: {
    type: String,
    required: true,
    index: true
  },
  dosageStrength: String,
  dosageForm: String,
  classification: String,
  pharmacologicCategory: String,
  packaging: String,
  manufacturer: String,
  countryOfOrigin: String,
  trader: String,
  importer: String,
  distributor: String,
  expiryDate: Date,
  registrationNumber: String,
  productInformation: String,
  confidence: {
    type: Number,
    default: 1.0
  },
  source: {
    type: String,
    required: true,
    enum: ['FDA', 'DOH', 'CUSTOM']
  }
}, {
  timestamps: true
});

// Create compound index for brand and generic name
medicineSchema.index({ brandName: 1, genericName: 1 });

const Medicine = mongoose.model("medicines", medicineSchema);
export default Medicine;
