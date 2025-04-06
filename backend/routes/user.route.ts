import { Router } from "express";
import cors from "cors";
import UserController from "../controllers/user.controller.js";
import ErrorHandler from "middleware/errorHandler.js";
import logger from "middleware/logger.js";

const userRouter: Router = Router();
const uc: UserController = new UserController();
const errorHandler: ErrorHandler = new ErrorHandler();
userRouter.use(cors());

userRouter.get("/:id", uc.getUser);
userRouter.post("/register", uc.registerUser);
userRouter.post("/login", uc.loginUser);
userRouter.put("/update/:id", uc.updateUser);
userRouter.delete("/delete/:id", uc.deleteUser);

userRouter.use(errorHandler.handleAllError);
userRouter.use(logger);

export default userRouter;
