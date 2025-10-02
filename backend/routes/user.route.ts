import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const userRouter = Router();
const uc = new UserController();
const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? [
      "https://medtalk.tech",
      "https://medtalk-webapp-122bcbf0f96e.herokuapp.com",
    ]
  : ["http://localhost:5173", "http://localhost:3000"];
userRouter.use(cookieParser());
if (!isProduction) {
  userRouter.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

userRouter.post("/admin/register", authenticateJwt, uc.registerAdmin);
userRouter.post("/admin/login", authenticateJwt, uc.loginAdmin);
userRouter.get("/admins", authenticateJwt, uc.getAdminUsers);
userRouter.get("/doctor", authenticateJwt, uc.getDoctors);
userRouter.post("/admin", authenticateJwt, uc.createDoctor);
userRouter.put("/admin", authenticateJwt, uc.updateAdmin);
userRouter.delete("/delete/batch", authenticateJwt, uc.deleteUsers);
userRouter.post("/register", authenticateJwt, uc.registerUser);
userRouter.get("/verify", uc.verifyUser);
userRouter.post("/login", authenticateJwt, uc.loginUser);
userRouter.post("/token", authenticateJwt, uc.refreshAccessToken);
userRouter.post("/logout", uc.logoutUser);
userRouter.post("/forgot-password", uc.requestPasswordReset);
userRouter.post("/reset-password", uc.resetPassword);
userRouter.put("/update", authenticateJwt, uc.updateUser);
userRouter.put("/change-password", authenticateJwt, uc.changePassword);
userRouter.delete("/delete", authenticateJwt, uc.deleteUser);
userRouter.get("/", authenticateJwt, uc.getUsers);

export default userRouter;
