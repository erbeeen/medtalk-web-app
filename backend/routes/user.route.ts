import express from "express";
import cors from "cors";
import UserController from "../controllers/user.controller";

const userRouter = express.Router();
const uc = new UserController();
userRouter.use(cors());

userRouter.post("/", uc.registerUser);

export default userRouter;
