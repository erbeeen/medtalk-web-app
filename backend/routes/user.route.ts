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

//{
//  "firstName": "john",
//  "lastName": "doe",
//  "email": "sample@gmail.com",
//  "username": "erbeen",
//  "password": "$2b$10$ULQ1z.SAbo6A432oGejiCexz5JCy/kK6RzOO442d4cQJNf.pxJYau",
//},

export default userRouter;
