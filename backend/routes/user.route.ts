import { Router } from "express";
import cors from "cors";
import UserController from "../controllers/user.controller.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
userRouter.use(cors());

userRouter.post("/register", uc.registerUser);
userRouter.post("/login", uc.loginUser);
userRouter.put("/update/", uc.updateUser);
userRouter.delete("/delete/", uc.deleteUser);
userRouter.get("/", uc.getUsers);

export default userRouter;
