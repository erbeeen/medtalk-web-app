import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserType, UserDocument } from "../models/user.model.js";
import {
  fetchUserByName,
  doesUserExist,
  hashPassword,
  comparePassword,
} from "../utils/user.utils.js";
import sendResponse from "utils/httpResponder.js";

type LoginCredentials = {
  username: string;
  password: string;
};

export default class UserController {
  constructor() {}

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const user: UserType = req.body;
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.username ||
      !user.password
    ) {
      sendResponse(res, 400, "provide all fields");
      return;
    }

    const [userExists, userExistsErr] = await doesUserExist(user.username);
    if (userExistsErr !== null) {
      next(userExistsErr);
      sendResponse(res, 500);
      return;
    }

    if (userExists) {
      sendResponse(res, 409, "username is already taken");
      return;
    }

    const [hashedPassword, hashErr] = hashPassword(user.password);
    if (hashErr) {
      next(hashErr);
      sendResponse(res, 500);
    }

    user.password = hashedPassword;
    const newUser: UserDocument = new User(user);

    try {
      await newUser.save();
      sendResponse(res, 201, "user created.");
      return;
    } catch (err) {
      next(err);
      sendResponse(res, 500);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const credentials: LoginCredentials = req.body;

    if (!credentials.username || !credentials.password) {
      sendResponse(res, 400, "provide all fields");
      return;
    }

    //const user: UserDocument = await fetchUserByName(credentials.username);
    const [user, fetchUserErr] = await fetchUserByName(credentials.username);
    if (fetchUserErr) {
      next(fetchUserErr);
      sendResponse(res, 500);
      return;
    }

    if (user === null) {
      sendResponse(res, 404, "invalid username or password");
      return;
    }

    const storedPassword: string = user.password;

    const [isPasswordCorrect, comparePasswordErr] = comparePassword(
      credentials.password,
      storedPassword,
    );

    if (comparePasswordErr) {
      next(comparePasswordErr);
      sendResponse(res, 500);
      return;
    }

    if (!isPasswordCorrect) {
      sendResponse(res, 404, "invalid username or password");
      return;
    }

    // TODO: Login credentials is correct. Do authentication
  };

  getAllUsers = async (Req: Request, res: Response, next: NextFunction) => {
    // TODO: return all users in db
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    try {
      // TODO: refactor to use [value, err] format
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

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: refactor
    const { id } = req.params;
    const editedUserDetails: UserType = req.body;

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

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    // TODO: refactor to use sendResponse
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
