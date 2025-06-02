import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller.js";
import cookieParser from "cookie-parser";

const scheduleRouter = Router();
const sc = new ScheduleController();
scheduleRouter.use(cookieParser());
scheduleRouter.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

scheduleRouter.get("/user", authenticateJwt, sc.getSchedulesByUserID);
scheduleRouter.get("/all", authenticateJwt, sc.getAllSchedule);
scheduleRouter.post("/", authenticateJwt, sc.addSchedule);
scheduleRouter.get("/", authenticateJwt, sc.getSchedule);
scheduleRouter.put("/", authenticateJwt, sc.updateSchedule);
scheduleRouter.delete("/", authenticateJwt, sc.deleteSchedule);

export default scheduleRouter;
