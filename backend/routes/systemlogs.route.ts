import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
import SystemLogsController from "../controllers/systemlogs.controller.js";

const systemLogsRouter = Router();
const slc = new SystemLogsController();
systemLogsRouter.use(cookieParser());
systemLogsRouter.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

systemLogsRouter.get("/", authenticateJwt, slc.getLogs);

export default systemLogsRouter;
