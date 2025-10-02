import { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authenticateJwt from "../middleware/jwtAuth.js";
import AnalyticsController from "../controllers/analytics.controller.js";

const analyticsRouter = Router();
const ac = new AnalyticsController();
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];
analyticsRouter.use(cookieParser());
if (!isProduction) {
  analyticsRouter.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

analyticsRouter.get("/day", authenticateJwt, ac.getDaily);
analyticsRouter.get("/week", authenticateJwt, ac.getWeekly);
analyticsRouter.get("/month", authenticateJwt, ac.getMonthly);

export default analyticsRouter;
