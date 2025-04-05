import { Router } from "express";
import cors from "cors";
import UserController from "../controllers/user.controller.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
userRouter.use(cors());

userRouter.get("/:id", uc.getUser);
userRouter.post("/register", uc.registerUser);
userRouter.post("/login", uc.loginUser);
userRouter.put("/update/:id", uc.updateUser);
userRouter.delete("/delete/:id", uc.deleteUser);

export default userRouter;
