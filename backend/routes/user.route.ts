import { Router } from "express";
import cors from "cors";
import UserController from "../controllers/user.controller.js";
import authenticateJwt from "../middleware/jwtAuth.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
userRouter.use(cors());

userRouter.post("/register", uc.registerUser);
userRouter.post("/login", uc.loginUser);
userRouter.put("/update", authenticateJwt, uc.updateUser);
userRouter.delete("/delete", authenticateJwt, uc.deleteUser);
userRouter.get("/", authenticateJwt, uc.getUsers);

export default userRouter;
