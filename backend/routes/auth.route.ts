
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";

const authRouter = Router();
const ac = new AuthController;
authRouter.use(cookieParser());
authRouter.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

authRouter.post("/validate", authenticateJwt, ac.validateAccessToken);
authRouter.post("/refresh-token", ac.refreshAccessToken);
authRouter.post("/logout", ac.logout);

export default authRouter;
