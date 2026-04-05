import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller.js";
import cookieParser from "cookie-parser";

const scheduleRouter = Router();
const sc = new ScheduleController();
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];
scheduleRouter.use(cookieParser());
if (!isProduction) {
  scheduleRouter.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

scheduleRouter.use(authenticateJwt);

scheduleRouter.get("/user", sc.getSchedulesByUserID);
scheduleRouter.get("/all", sc.getAllSchedule);
scheduleRouter.get("/format", sc.getFormattedSchedulesByID);
scheduleRouter.delete("/batch", sc.deleteSchedules);
scheduleRouter.post("/", sc.addBatchSchedule);
scheduleRouter.get("/", sc.getSchedule);
scheduleRouter.put("/", sc.updateSchedule);
scheduleRouter.delete("/", sc.deleteSchedule);

export default scheduleRouter;
