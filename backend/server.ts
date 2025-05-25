import cors from "cors";
import dbConnect from "./config/db.js";
import dotenv from "dotenv";
import express, { static as static_ } from "express";
import { fileURLToPath } from "url";
import logger from "./middleware/logger.js";
import path from "path";
import medicineRouter from "./routes/medicine.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(logger);

//multiplexer
// API routes
app.use("/api/medicine", medicineRouter);
app.use("/api/users", userRouter);

// Serve static files
app.use(static_(path.join(__dirname, "../frontend/dist")));

// Connect to database
dbConnect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
