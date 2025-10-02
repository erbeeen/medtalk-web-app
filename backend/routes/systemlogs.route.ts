import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
import SystemLogsController from "../controllers/systemlogs.controller.js";

const systemLogsRouter = Router();
const slc = new SystemLogsController();
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];
systemLogsRouter.use(cookieParser());
if (!isProduction) {
  systemLogsRouter.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

systemLogsRouter.get("/", authenticateJwt, slc.getLogs);

export default systemLogsRouter;
