import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserType, UserDocument } from "../models/user.model.js";
import {
  fetchUserByName,
  doesUserExist,
  doesUserIdExist,
} from "../utils/user.utils.js";
import bcrypt from "bcrypt";
import sendJsonResponse from "utils/httpResponder.js";
import { logError } from "middleware/logger.js";

type LoginCredentials = {
  username: string;
  password: string;
};

export default class UserController {
  constructor() {}

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    let user: UserType = req.body;
    const saltRounds = 10;
    if (
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.username ||
      !user.password
    ) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [userExists, userExistsErr] = await doesUserExist(user.username);
    if (userExistsErr !== null) {
      next(userExistsErr);
      sendJsonResponse(res, 500);
      return;
    }

    if (userExists) {
      sendJsonResponse(res, 409, "username is already taken");
      return;
    }

    bcrypt.hash(user.password, saltRounds, (error: Error, hashed: string) => {
      if (error) {
        console.error("registerUser bcrypt.hash error");
        next(error);
        logError(error)
        sendJsonResponse(res, 500);
      } else {
        const newUser: UserDocument = new User({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          password: hashed,
        });

        try {
          const result = newUser.save();
          sendJsonResponse(res, 201, result);
        } catch (err: any) {
          console.error("registerUser newUser.save error");
          next(err);
          logError(err);
          sendJsonResponse(res, 500);
        } finally {
          return;
        }
      }
    });
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const credentials: LoginCredentials = req.body;

    if (!credentials.username || !credentials.password) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [user, fetchUserErr] = await fetchUserByName(credentials.username);

    if (fetchUserErr) {
      next(fetchUserErr);
      sendJsonResponse(res, 500);
      return;
    }

    if (user === null) {
      sendJsonResponse(res, 401, "invalid username or password");
      return;
    }

    const storedPassword: string = user.password;

    bcrypt.compare(
      credentials.password,
      storedPassword,
      (err: Error, result: boolean) => {
        if (err) {
          next(err);
          sendJsonResponse(res, 500);
        }
        if (!result) {
          sendJsonResponse(res, 401, "invalid username or password");
          return;
        }
        // TODO: Login credentials is correct. Do authentication
        sendJsonResponse(res, 200, user);
        return;
      },
    );
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: when sending back the user, don't show the password
    const id = String(req.query.id);

    if (id !== "undefined") {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendJsonResponse(res, 400, "invalid id");
        return;
      }

      try {
        const user: UserDocument = await User.findById(id);

        if (user === null) {
          sendJsonResponse(res, 404, `no user with id ${id}`);
        } else {
          sendJsonResponse(res, 200, user);
        }
      } catch (err: any) {
        console.error("User.findByID error:");
        next(err);
        logError(err);
        sendJsonResponse(res, 500);
      } finally {
        return;
      }
    }
    try {
      const users: Array<UserType> = await User.find({});
      sendJsonResponse(res, 200, users);
    } catch (err) {
      console.error("User.find error:");
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
    } finally {
      return;
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: what to do when the password is used
    const id: string = String(req.query.id);
    const editedUserDetails: UserType = req.body;

    if (id === "undefined") {
      sendJsonResponse(res, 400, "no id included");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendJsonResponse(res, 400, "invalid id");
      return;
    }

    try {
      const [userIdExists, userIdErr] = await doesUserIdExist(id);
      if (userIdErr !== null) {
        sendJsonResponse(res, 500);
        return;
      } else if (!userIdExists) {
        sendJsonResponse(res, 404, `no user with id ${id}`);
        return;
      }
    } catch (err) {
      console.error("updateUser doesUserIdExist error");
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
      return;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(id, editedUserDetails, {
        new: true,
      });
      sendJsonResponse(res, 201, updatedUser);
    } catch (err: any) {
      console.error("updateUser User.findByIdandUpdate error");
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
    } finally {
      return;
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = String(req.query.id);

    if (id === "undefined") {
      sendJsonResponse(res, 400, "no id included");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendJsonResponse(res, 400, "invalid id");
    }

    try {
      const [userIdExists, userIdErr] = await doesUserIdExist(id);
      if (userIdErr !== null) {
        sendJsonResponse(res, 500);
        return;
      } else if (!userIdExists) {
        sendJsonResponse(res, 404, `no user with id ${id}`);
        return;
      }
    } catch (err) {
      console.error("deleteUser doesUserIdExist error");
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
      return;
    }

    try {
      await User.findByIdAndDelete(id);
      sendJsonResponse(res, 204, "user deleted");
    } catch (err: any) {
      console.error("deleteUser User.findByIdandDelete error");
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
    } finally {
      return;
    }
  };
}
