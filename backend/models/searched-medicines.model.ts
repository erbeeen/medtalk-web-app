import mongoose from "mongoose";

export type SearchedMedicineType = {
  _id?: mongoose.Types.ObjectId | String;
  medicine: String;
  dateSearched: Date;
};

export type SearchedMedicineDocument = SearchedMedicineType & mongoose.Document;

const searchedMedicineSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true,
  },
  dateSearched: {
    type: Date,
    default: Date.now
  }
});

const SearchedMedicine = mongoose.model("searched_medicines", searchedMedicineSchema);
export default SearchedMedicine;
