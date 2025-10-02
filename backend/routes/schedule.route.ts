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
scheduleRouter.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

scheduleRouter.get("/user", authenticateJwt, sc.getSchedulesByUserID);
scheduleRouter.get("/all", authenticateJwt, sc.getAllSchedule);
scheduleRouter.get("/format", authenticateJwt, sc.getFormattedSchedulesByID);
scheduleRouter.delete("/batch", authenticateJwt, sc.deleteSchedules);
scheduleRouter.post("/", authenticateJwt, sc.addBatchSchedule);
scheduleRouter.get("/", authenticateJwt, sc.getSchedule);
scheduleRouter.put("/", authenticateJwt, sc.updateSchedule);
scheduleRouter.delete("/", authenticateJwt, sc.deleteSchedule);

export default scheduleRouter;
