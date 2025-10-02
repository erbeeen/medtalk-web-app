
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";

const authRouter = Router();
const ac = new AuthController;
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];
authRouter.use(cookieParser());
authRouter.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

authRouter.post("/validate", authenticateJwt, ac.validateAccessToken);
authRouter.post("/refresh-token", authenticateJwt, ac.refreshAccessToken);
authRouter.post("/logout", authenticateJwt, ac.logout);

export default authRouter;
