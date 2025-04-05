import { Request, Response } from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User, { UserDocument, UserModel } from "../models/user.model.js";
import {
  doesUserExist,
  hashPassword,
  fetchUserByName,
  fetchUserById,
} from "../utils/user.utils.js";

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

    user.password = hashPassword(user.password);
    const newUser: mongoose.Document = new User(user);

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

  loginUser = async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body;

    if (!credentials.username || !credentials.password) {
      res.status(400).json({
        success: false,
        data: "provide all fields.",
      });
      return;
    }

    const user: UserDocument = await fetchUserByName(credentials.username);
    if (user === null) {
      res.status(404).json({
        success: false,
        data: "invalid username or password",
      });
    }

    const storedPassword: string = user.password;
    bcrypt.compare(credentials.password, storedPassword, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          data: "internal server error",
        });
      }

      if (result) {
        res.status(200).json({
          success: true,
          data: user,
        });
      } else {
        res.status(404).json({
          success: false,
          data: "invalid username or password",
        })
      }
    });
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const user = req.body;

    const storedUser: UserDocument|null = await fetchUserById(user.id);
    if (storedUser === null) {
      // TODO: Send a user not found error
    }
    
    // TODO: update the user in database
  }

}
