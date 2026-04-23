import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function dbConnect() {
  await mongoose.connect(process.env.MEDICINE_MONGODB_URI!, {
    dbName: "development",
  });
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    mongoose.set("debug", true);
  }
}
