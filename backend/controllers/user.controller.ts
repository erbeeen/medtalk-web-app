import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserInterface, UserDocument } from "../models/user.model.js";
import {
  fetchUserByName,
  doesUserExist,
  hashPassword,
  comparePassword,
} from "../utils/user.utils.js";

export default class UserController {
  constructor() {}

  registerUser = async (req: Request, res: Response) => {
    const user = req.body;
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.username ||
      !user.password
    ) {
      res.status(400).json({
        success: false,
        message: "provide all fields.",
      });
      return;
    }

    try {
      if (await doesUserExist(user.username)) {
        res.status(409).json({
          success: false,
          message: "username already taken.",
        });
        return;
      }

      user.password = hashPassword(user.password);
      const newUser: mongoose.Document = new User(user);

      await newUser.save();
      res.status(201).json({ success: true, data: newUser });
      return;
    } catch (err: any) {
      console.error(`registerUser error:, ${err}`);
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
      return;
    }
  };

  loginUser = async (req: Request, res: Response) => {
    const credentials = req.body;

    if (!credentials.username || !credentials.password) {
      res.status(400).json({
        success: false,
        data: "provide all fields.",
      });
      return;
    }

    try {
      const user: UserDocument = await fetchUserByName(credentials.username);
      if (user === null) {
        res.status(404).json({
          success: true,
          data: "invalid username or password",
        });
        return;
      }

      const storedPassword: string = user.password;

      const isPasswordCorrect: boolean | Error | null = comparePassword(
        credentials.password,
        storedPassword,
      );

      if (isPasswordCorrect instanceof Error) {
        throw isPasswordCorrect;
      } else if (isPasswordCorrect === null) {
        throw new Error("bcrypt.compare did not function and was skipped");
      }
    } catch (err: any) {
      console.error(`loginUser error: ${err}`);
      res.status(500).json({
        success: false,
        data: "internal server error",
      });
      return;
    }
  };

  getUser = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
      const user = await fetchUserByName(username);
      if (user === null) {
        res.status(404).json({
          success: true,
          data: "user not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
      return;
    } catch (err: any) {
      console.error(`getUser error: ${err}`);
      res.status(500).json({
        success: false,
        data: "internal server error",
      });
      return;
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const editedUserDetails: UserInterface = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        data: "invalid id",
      });
      return;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, editedUserDetails, {
        new: true,
      });
      res.status(201).json({
        success: true,
        data: updatedUser,
      });
      return;
    } catch (err: any) {
      console.error(`updateUser error: ${err}`);
      res.status(500).json({
        success: false,
        data: "internal server error",
      });
      return;
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        data: "invalid id",
      });
    }

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      res.status(204).json({ success: true, data: deletedUser });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        data: "internal server error",
      });
    }
  };
}
