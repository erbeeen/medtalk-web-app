import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./config/db.js";
import express, { static as static_ } from "express";
import { fileURLToPath } from "url";
import logger from "./middleware/logger.js";
import path from "path";
import authRouter from "./routes/auth.route.js";
import medicineRouter from "./routes/medicine.route.js";
import scheduleRouter from "./routes/schedule.route.js";
import systemLogsRouter from "./routes/systemlogs.route.js";
import userRouter from "./routes/user.route.js";
import analyticsRouter from "./routes/analytics.route.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(helmet());
if (!isProduction) {
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  }),
);

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
  }),
);

app.use(helmet.xContentTypeOptions());

app.use(compression());

app.use(express.json());
app.use(logger);
app.use("/api/users", userRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/auth", authRouter);
app.use("/api/logs", systemLogsRouter);
app.use("/api/analytics", analyticsRouter);

if (process.env.NODE_ENV === "production") {
  app.use(static_(path.join(__dirname + "/static")));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "static", "index.html"));
  });
}

app.listen(PORT, async () => {
  try {
    console.clear();
    console.log("Initializing MongoDB Connection.");
    await dbConnect();
    console.log("Database connection successful.\n");

    console.log("Backend server running");
  } catch (err) {
    console.error("Error starting server: ", err.stack);
    process.exit(1);
  }
});
