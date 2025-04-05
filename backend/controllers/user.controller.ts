import { Request, Response } from "express";
import User from "../models/user.model.js";
import { doesUserExist } from "../utils/user.utils.js";

export default class UserController {
  constructor() {}

  registerUser = async (req: Request, res: Response): Promise<void> => {
    const user = req.body;
    if (!user.firstName || !user.lastName || !user.username || !user.password) {
      res.status(400).json({
        success: false,
        message: "provide all fields.",
      });
      return;
    }

    if (await doesUserExist(user.username)) {
      res.status(409).json({
        success: false,
        message: "username already taken.",
      });
      return;
    }

    const newUser = new User(user);

    try {
      await newUser.save();
      res.status(201).json({ success: true, data: newUser });
      return;
    } catch (err: Error | any) {
      console.error("registerUser: Error in registering user:", err.message);
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
      return;
    }
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    return;
  }

}
