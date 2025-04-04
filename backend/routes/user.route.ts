import { Router } from "express";
import cors from "cors";
import UserController from "../controllers/user.controller.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
userRouter.use(cors());

userRouter.post("/", uc.registerUser);

export default userRouter;
