import { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticateJwt from "../middleware/jwtAuth.js";
import AnalyticsController from "../controllers/analytics.controller.js";

const analyticsRouter = Router();
const ac = new AnalyticsController();
analyticsRouter.use(cookieParser());
analyticsRouter.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

analyticsRouter.get("/day", authenticateJwt, ac.getDaily);
analyticsRouter.get("/week", authenticateJwt, ac.getWeekly);
analyticsRouter.get("/month", authenticateJwt, ac.getMonthly);

export default analyticsRouter;
