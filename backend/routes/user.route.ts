import authenticateJwt from "../middleware/jwtAuth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
userRouter.use(cookieParser());
userRouter.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

userRouter.delete("/delete/batch", authenticateJwt, uc.deleteUsers);
userRouter.post("/register", authenticateJwt, uc.registerUser);
userRouter.post("/login", authenticateJwt, uc.loginUser);
userRouter.post("/token", authenticateJwt, uc.refreshAccessToken);
// TODO: Test functionality without and with auth middleware
userRouter.post("/logout", uc.logoutUser);
userRouter.put("/update", authenticateJwt, uc.updateUser);
userRouter.delete("/delete", authenticateJwt, uc.deleteUser);
userRouter.get("/admins", authenticateJwt, uc.getAdminUsers);
userRouter.get("/", authenticateJwt, uc.getUsers);

export default userRouter;
