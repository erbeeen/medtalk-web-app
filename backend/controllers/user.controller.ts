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
import { createToken } from "middleware/auth.js";

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
        console.error(`${this.registerUser.name} bcrypt.hash error`);
        next(error);
        logError(error);
        sendJsonResponse(res, 500);
      } else {
        const newUser: UserDocument = new User({
          role: "user",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          password: hashed,
        });

        try {
          newUser.save();
          sendJsonResponse(res, 201, "user created");
        } catch (err: any) {
          console.error(`${this.registerUser.name} newUser.save error`);
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

    bcrypt.compare(
      credentials.password,
      user.password,
      (err: Error, result: boolean) => {
        if (err) {
          console.error(`${this.loginUser.name} bcrypt.compare error: ${err}`);
          next(err);
          logError(err);
          sendJsonResponse(res, 500);
        }
        if (!result) {
          sendJsonResponse(res, 401, "invalid username or password");
          return;
        }
        delete credentials.password;
        delete user.password;

        const [token, tokenErr] = createToken(String(user._id), user.email);
        if (tokenErr !== null) {
          console.error(`${this.loginUser.name} jwt.sign error: ${err}`);
          next(err);
          logError(err);
          sendJsonResponse(res, 500);
        }

        res.status(200).json({
          id: user._id,
          email: user.email,
          token: token,
        });
      },
    );
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const id = String(req.query.id);

    if (id !== "undefined") {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendJsonResponse(res, 400, "invalid id");
        return;
      }

      try {
        let user: UserDocument = await User.findById(id);

        if (user === null) {
          sendJsonResponse(res, 404, `no user with id ${id}`);
        } else {
          sendJsonResponse(res, 200, {
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        }
      } catch (err: any) {
        console.error(`${this.getUsers.name} User.findByID error:`);
        next(err);
        logError(err);
        sendJsonResponse(res, 500);
      } finally {
        return;
      }
    }
    try {
      const userDocuments: Array<UserDocument> = await User.find({});
      let users: Array<UserType> = [];
      userDocuments.map((user) =>
        users.push({
          id: String(user._id),
          role: user.role,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      );
      sendJsonResponse(res, 200, users);
    } catch (err) {
      console.error(`${this.getUsers.name} User.find error:`);
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
    } finally {
      return;
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: what to do when the password is changed
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
      console.error(`${this.updateUser.name} doesUserIdExist error`);
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
      console.error(`${this.updateUser.name} User.findByIdandUpdate error`);
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
      console.error(`${this.deleteUser.name} doesUserIdExist error`);
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
      return;
    }

    try {
      await User.findByIdAndDelete(id);
      sendJsonResponse(res, 204, "user deleted");
    } catch (err: any) {
      console.error(`${this.deleteUser.name} User.findByIdandDelete error`);
      next(err);
      logError(err);
      sendJsonResponse(res, 500);
    } finally {
      return;
    }
  };
}
