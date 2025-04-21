import { Router } from "express";
import cors from "cors";
import UserController from "../controllers/user.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
userRouter.use(cors());

userRouter.post("/register", authenticateJwt, uc.registerUser);
userRouter.post("/login", authenticateJwt, uc.loginUser);
userRouter.post("/token", authenticateJwt, uc.refreshAccessToken);
// TODO: Test functionality without and with auth middleware
userRouter.post("/logout", uc.logoutUser);
userRouter.put("/update", authenticateJwt, uc.updateUser);
userRouter.delete("/delete", authenticateJwt, uc.deleteUser);
userRouter.get("/", authenticateJwt, uc.getUsers);

export default userRouter;
