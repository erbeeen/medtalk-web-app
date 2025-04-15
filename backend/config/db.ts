import mongoose from "mongoose";

export default async function dbConnect() {
  try {
    const conn = await mongoose.connect(process.env.MEDICINE_MONGODB_URI!, {
      dbName: "development"
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
