import cors from "cors";
import dbConnect from "./config/db.js";
import dotenv from "dotenv";
import express, { static as static_ } from "express";
import { fileURLToPath } from "url";
import logger from "./middleware/logger.js";
import path from "path";
import userRouter from "./routes/user.route.js";
import medicineRouter from "./routes/medicine.route.js";
import scheduleRouter from "./routes/schedule.routes.js";
import { initializeTransporter } from "./config/nodemailer.js";
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

console.log("Initializing Mail Transporter");
await initializeTransporter();
console.log("Initialization successsful.\n");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(logger);
app.use("/api/users", userRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/schedule", scheduleRouter);

if (process.env.NODE_ENV === "production") {
  app.use(static_(path.join(__dirname + "/static")));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "static", "index.html"));
  });
}

app.listen(PORT, async () => {
  try {
    console.log("Initializing MongoDB Connection.");
    await dbConnect();
    console.log("Connection successful.\n");

    console.log("Backend server running");
  } catch (err) {
    console.error("Error starting server: ", err.stack);
    process.exit(1);
  }
});
