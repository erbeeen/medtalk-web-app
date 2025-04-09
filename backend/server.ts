import path from "path";
import express, { static as static_ } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";
import userRouter from "./routes/user.route.js";
import searchMedRouter from "./routes/search-medicine.route.js";
import { fileURLToPath } from "url";
import logger from "middleware/logger.js";
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/api/users", userRouter);
app.use("/api/medicine/search", searchMedRouter);

if (process.env.NODE_ENV === "production") {
  app.use(static_(path.join(__dirname + "/static")));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "static", "index.html"));
  });
}

app.listen(PORT, async () => {
  await dbConnect();
  console.log("Backend server running");
});
