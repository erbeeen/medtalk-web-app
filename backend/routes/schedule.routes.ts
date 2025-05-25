import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller.js";

const scheduleRouter = Router();
const sc = new ScheduleController();
scheduleRouter.use(cors());

scheduleRouter.post("/", authenticateJwt, sc.addSchedule);
scheduleRouter.get("/", authenticateJwt, sc.getSchedule);
scheduleRouter.put("/", authenticateJwt, sc.updateSchedule);
scheduleRouter.delete("/", authenticateJwt, sc.deleteSchedule);

export default scheduleRouter;
