import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import {
  doesUserExist,
  doesUserIdExist,
  fetchUserByEmail,
} from "../utils/user.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  validateRefreshToken,
} from "../auth/auth.js";
import { logError } from "../middleware/logger.js";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import RefreshToken, {
  RefreshTokenDocument,
} from "../models/refresh-token.model.js";
import sendJsonResponse from "../utils/httpResponder.js";
import User, { UserType, UserDocument } from "../models/user.model.js";
import SystemLog from "../models/system-logs.model.js";
import PasswordResetToken from "../models/password-reset-token.model.js";
import sendEmail from "../config/nodemailer.js";

type LoginCredentials = {
  email: string;
  password: string;
};

const USER_ROLE = "user";
const DOCTOR_ROLE = "doctor";
const FROM_EMAIL = `MedTalk <${process.env.MAIL_USERNAME}>`;

export default class UserController {
  constructor() {}

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const user: UserType = req.body;
    const saltRounds = 10;
    if (
      !user.email ||
      !user.username ||
      !user.firstName ||
      !user.lastName ||
      !user.password
    ) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [usernameExists, emailExists, userExistsErr] = await doesUserExist(
      user.username,
      user.email,
    );
    if (userExistsErr !== null) {
      next(userExistsErr);
      sendJsonResponse(res, 500);
      return;
    }

    if (usernameExists) {
      sendJsonResponse(res, 409, "username is already taken");
      return;
    }

    if (emailExists) {
      sendJsonResponse(res, 409, "email is already taken");
      return;
    }

    bcrypt.hash(
      user.password,
      saltRounds,
      async (error: Error, hashed: string) => {
        if (error) {
          console.error(`${this.registerUser.name} bcrypt.hash error`);
          logError(error);
          sendJsonResponse(res, 500);
          next(error);
          return;
        }
        const newUser: UserDocument = new User({
          verified: false,
          role: USER_ROLE,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          password: hashed,
        });

        try {
          const result = await newUser.save();

          const [accessToken, accessTokenErr] = generateAccessToken(
            String(result._id),
            result.username,
            USER_ROLE,
          );
          if (accessTokenErr !== null) {
            console.error(
              `${this.registerUser.name} generate access token error: ${accessTokenErr}\n${accessTokenErr.stack}`,
            );
            logError(accessTokenErr);
            sendJsonResponse(res, 500);
            next(accessTokenErr);
            return;
          }

          const [refreshToken, refreshTokenErr] = generateRefreshToken(
            String(result._id),
            result.username,
            USER_ROLE,
          );
          if (refreshTokenErr !== null) {
            console.error(
              `${this.registerUser.name} generate refresh token error: ${refreshTokenErr}\n${refreshTokenErr.stack}`,
            );
            logError(refreshTokenErr);
            sendJsonResponse(res, 500);
            next(refreshTokenErr);
            return;
          }

          const newToken: RefreshTokenDocument = new RefreshToken({
            token: refreshToken,
          });
          newToken.save();

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
          });
          sendJsonResponse(res, 201);

          // WARN: This is not the correct implementation. The link should be a frontend route,
          // not the API route. The frontend route will call the API route. Use only for testing if this function works

          const baseUrl = process.env.BASE_URL || "localhost:3000";
          sendEmail({
            from: FROM_EMAIL,
            to: result.email,
            subject: "Account Verification - MedTalk",
            text: `Thank you for signing up at MedTalk! Click the link to verify your account. https://${baseUrl}/verify-account/?id=${result._id}`,
            html: `<p>Thank you for signing up at MedTalk! Click <a href="https://${baseUrl}/verify-account/?id=${result._id}">here</a> to verify your account.</p>`,
          });

          await SystemLog.create({
            level: "info",
            source: "user-registration",
            category: "authentication",
            message: "User registration successful.",
            data: {
              _id: result._id,
              email: result.email,
              username: result.username,
            },
          });
        } catch (err) {
          console.error(`${this.registerUser.name} newUser.save error`);
          logError(err);
          sendJsonResponse(res, 500);
          next(err);
          await SystemLog.create({
            level: "error",
            source: "user-registration",
            category: "authentication",
            message: "User registration failed.",
            data: {
              error: err,
            },
          });
          return;
        }
      },
    );
  };

  verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.id === undefined) {
      sendJsonResponse(res, 400, "no id included");
    }

    const id = String(req.query.id);

    if (id !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendJsonResponse(res, 400, "invalid id");
        return;
      }
    }

    try {
      const result = await User.findByIdAndUpdate(
        id,
        { verified: true },
        { new: true },
      );
      sendJsonResponse(res, 200);

      await SystemLog.create({
        level: "info",
        source: "user-authentication",
        category: "authentication",
        message: "User email verification successful.",
        data: {
          _id: result._id,
          email: result.email,
          username: result.username,
        },
      });
    } catch (err) {
      console.error(`${this.verifyUser.name} User.findByIdandUpdate error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "user-authentication",
        category: "authentication",
        message: "User email verification failed.",
        data: {
          error: err,
        },
      });
      next(err);
    } finally {
      return;
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const isBodyEmpty =
      req.body === undefined || Object.keys(req.body).length === 0;

    if (req.user !== undefined && isBodyEmpty) {
      sendJsonResponse(res, 200);
      return;
    }

    const credentials: LoginCredentials = req.body;

    if (!credentials.email || !credentials.password) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [user, fetchUserErr] = await fetchUserByEmail(credentials.email);

    if (fetchUserErr) {
      sendJsonResponse(res, 500);
      next(fetchUserErr);
      return;
    }

    if (user === null) {
      sendJsonResponse(res, 401, "invalid email or password");
      return;
    }

    bcrypt.compare(
      credentials.password,
      user.password,
      async (err: Error, result: boolean) => {
        if (err) {
          console.error(`${this.loginUser.name} bcrypt.compare error: ${err}`);
          logError(err);
          sendJsonResponse(res, 500);
          next(err);
          return;
        }
        if (!result) {
          sendJsonResponse(res, 401, "invalid email or password");
          return;
        }

        if (!user.verified) {
          sendJsonResponse(res, 400, "user not verified");
        }

        const [accessToken, accessTokenErr] = generateAccessToken(
          String(user._id),
          user.username,
          user.role,
        );
        if (accessTokenErr !== null) {
          console.error(
            `${this.loginUser.name} Generate Access Token error: ${accessTokenErr}\n${accessTokenErr.stack}`,
          );
          logError(accessTokenErr);
          sendJsonResponse(res, 500);
          next(accessTokenErr);
          return;
        }

        const [refreshToken, refreshTokenErr] = generateRefreshToken(
          String(user._id),
          user.username,
          user.role,
        );
        if (refreshTokenErr !== null) {
          console.error(
            `${this.loginUser.name} Generate Refresh Token Error: ${refreshTokenErr}\n${refreshTokenErr.stack}`,
          );
          logError(refreshTokenErr);
          sendJsonResponse(res, 500);
          next(refreshTokenErr);
          return;
        }

        try {
          const newToken = new RefreshToken({
            token: refreshToken,
          });
          await newToken.save();
          const isProduction = process.env.NODE_ENV === "production";
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
          });
          sendJsonResponse(res, 200);
          await SystemLog.create({
            level: "info",
            source: "user-authentication",
            category: "authentication",
            message: "User login successful.",
            initiated_by: user.username,
          });
        } catch (err) {
          console.error(
            `${this.loginUser.name} save refresh token error: ${err}\n${err.stack}`,
          );
          logError(err);
          sendJsonResponse(res, 500);
          await SystemLog.create({
            level: "error",
            source: "user-authentication",
            category: "authentication",
            message: "User login failed.",
            initiated_by: user.username,
          });
          next(err);
          return;
        }
      },
    );
  };

  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let refreshToken = req.cookies.refreshToken;
    if (refreshToken === undefined) {
      refreshToken = req.body.token;
    }

    if (refreshToken === undefined) {
      res.sendStatus(401);
      return;
    }
    try {
      const tokenFromDb = await RefreshToken.findOne({ token: refreshToken });
      if (tokenFromDb === null) {
        res.sendStatus(403);
        return;
      }
      const [accessToken, isTokenValid, accessTokenErr] =
        await refreshAccessToken(refreshToken);
      if (accessTokenErr !== null) {
        console.error(
          `${this.refreshAccessToken.name} access token error: ${accessTokenErr}\n${accessTokenErr.stack}`,
        );
        logError(accessTokenErr);
        sendJsonResponse(res, 500);
        next(accessTokenErr);
        return;
      }
      if (!isTokenValid) {
        sendJsonResponse(res, 403);
        return;
      }
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      });
      sendJsonResponse(res, 201, "new token created.");
      return;
    } catch (err) {
      console.error(
        `${this.refreshAccessToken.name} db query error: ${err}\n${err.stack}`,
      );
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
      return;
    }
  };

  logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    let refreshToken: string = req.body.token;

    if (refreshToken === undefined) {
      refreshToken = req.cookies.refreshToken;
    }

    if (refreshToken === undefined) {
      sendJsonResponse(res, 400, "provide refreshToken");
      return;
    }

    const [isTokenValid, tokenValidErr] =
      await validateRefreshToken(refreshToken);
    if (tokenValidErr !== null) {
      logError(tokenValidErr);
      sendJsonResponse(res, 500);
      next(tokenValidErr);
      return;
    }

    if (!isTokenValid) {
      sendJsonResponse(res, 400, "invalid token");
      return;
    }

    try {
      await RefreshToken.findOneAndDelete({ refreshToken });
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("accessToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 0,
      });
      res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 0,
      });
      sendJsonResponse(res, 200, "token removed");
      await SystemLog.create({
        level: "info",
        source: "user-logout",
        category: "authentication",
        message: "User logout successful.",
        initiated_by: req.user.username,
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "user-logout",
        category: "authentication",
        message: "User logout failed.",
        initiated_by: req.user.username,
        data: {
          error: err,
        },
      });
      next(err);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.id !== undefined) {
      const id = String(req.query.id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendJsonResponse(res, 400, "invalid id");
        return;
      }

      try {
        const user = await User.findById(id);

        if (user === null) {
          sendJsonResponse(res, 404, `no user with id ${id}`);
        } else {
          sendJsonResponse(res, 200, {
            _id: user._id,
            role: user.role,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          });
        }
      } catch (err) {
        console.error(`${this.getUsers.name} User.findByID error:`);
        logError(err);
        sendJsonResponse(res, 500);
        next(err);
      } finally {
        return;
      }
    }
    try {
      const userDocuments: Array<UserDocument> = await User.find({
        role: { $in: ["user"] },
      });
      let users: Array<UserType> = [];
      userDocuments.map((user) =>
        users.push({
          _id: String(user._id),
          verified: user.verified,
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
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    } finally {
      return;
    }
  };

  getAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "super admin") {
      res.sendStatus(403);
      return;
    }

    try {
      const admins = await User.find({
        role: { $in: ["admin", "super admin"] },
      });
      sendJsonResponse(res, 200, admins);
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

  registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "super admin") {
      res.sendStatus(403);
      return;
    }

    const allChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|}{[]:;?><,./-=";
    const passwordLength = 10;
    let generatedPassword = "";

    const saltRounds = 10;
    const admin: UserType = req.body;

    if (
      !admin.role ||
      !admin.username ||
      !admin.email ||
      !admin.firstName ||
      !admin.lastName
    ) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [usernameExists, emailExists, userExistsErr] = await doesUserExist(
      admin.username,
      admin.email,
    );
    if (userExistsErr !== null) {
      next(userExistsErr);
      sendJsonResponse(res, 500);
      return;
    }

    if (usernameExists) {
      sendJsonResponse(res, 409, "username is already taken");
      return;
    }

    if (emailExists) {
      sendJsonResponse(res, 409, "email is already taken");
      return;
    }

    const bytes = randomBytes(passwordLength);

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = bytes[i] % allChars.length;
      generatedPassword += allChars[randomIndex];
    }

    bcrypt.hash(
      generatedPassword,
      saltRounds,
      async (error: Error, hashed: string) => {
        if (error) {
          console.error(`${this.registerAdmin.name} bcrypt.hash error`);
          logError(error);
          sendJsonResponse(res, 500);
          next(error);
          return;
        }
        const newAdmin: UserDocument = new User({
          verified: false,
          role: admin.role,
          email: admin.email,
          username: admin.username,
          firstName: admin.firstName,
          lastName: admin.lastName,
          password: hashed,
        });

        try {
          const result = await newAdmin.save();
          sendJsonResponse(res, 201, result);

          sendEmail({
            from: FROM_EMAIL,
            to: result.email,
            subject: "Account Created - MedTalk",
            text: `An account has been created on your email. Here are your credentials when logging in:\nEmail: ${result.email}\nPassword: ${generatedPassword}\nDo not forget to change your password after first log in.`,
            html: `<p>An account has been created on your email. Here are your credentials when logging in:<br><br>Email: ${result.email}<br>Password: ${generatedPassword}<br><br>Do not forget to change your password after first log in.</p>`,
          });

          await SystemLog.create({
            level: "info",
            source: "admin-creation",
            category: "admin-management",
            message: "Admin account creation successful.",
            initiated_by: req.user.username,
            data: {
              email: result.email,
              username: result.username,
            },
          });
        } catch (err) {
          console.error(`${this.registerAdmin.name} newAdmin.save error`);
          logError(err);
          sendJsonResponse(res, 500);
          await SystemLog.create({
            level: "error",
            source: "admin-creation",
            category: "admin-management",
            message: "Admin account creation failed.",
            initiated_by: req.user.username,
            data: {
              error: err,
            },
          });
          next(err);
        }
      },
    );
  };

  loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user !== undefined) {
      const isTokenFromUser =
        req.user.role !== "super admin" &&
        req.user.role !== "admin" &&
        req.user.role !== "doctor";
      const isBodyEmpty =
        req.body === undefined || Object.keys(req.body).length === 0;

      if (req.user !== undefined && !isTokenFromUser && isBodyEmpty) {
        sendJsonResponse(res, 200);
        return;
      }
    }

    const credentials: LoginCredentials = req.body;

    if (!credentials.email || !credentials.password) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [user, fetchUserErr] = await fetchUserByEmail(credentials.email);

    if (fetchUserErr) {
      sendJsonResponse(res, 500);
      next(fetchUserErr);
      return;
    }

    if (!user) {
      sendJsonResponse(res, 401, "invalid email or password");
      return;
    }

    const isNotAdmin =
      user.role !== "super admin" &&
      user.role !== "admin" &&
      user.role !== "doctor";
    if (isNotAdmin) {
      sendJsonResponse(res, 401, "invalid email or password");
      return;
    }

    bcrypt.compare(
      credentials.password,
      user.password,
      async (err: Error, result: boolean) => {
        if (err) {
          console.error(`${this.loginUser.name} bcrypt.compare error: ${err}`);
          logError(err);
          sendJsonResponse(res, 500);
          next(err);
          return;
        }
        if (!result) {
          sendJsonResponse(res, 401, "invalid email or password");
          return;
        }

        const [accessToken, accessTokenErr] = generateAccessToken(
          String(user._id),
          user.username,
          user.role,
        );
        if (accessTokenErr !== null) {
          console.error(
            `${this.loginUser.name} Generate Access Token error: ${accessTokenErr}\n${accessTokenErr.stack}`,
          );
          logError(accessTokenErr);
          sendJsonResponse(res, 500);
          next(accessTokenErr);
          return;
        }

        const [refreshToken, refreshTokenErr] = generateRefreshToken(
          String(user._id),
          user.username,
          user.role,
        );
        if (refreshTokenErr !== null) {
          console.error(
            `${this.loginAdmin.name} Generate Refresh Token Error: ${refreshTokenErr}\n${refreshTokenErr.stack}`,
          );
          logError(refreshTokenErr);
          sendJsonResponse(res, 500);
          next(refreshTokenErr);
          return;
        }

        try {
          const newToken = new RefreshToken({
            token: refreshToken,
          });
          await newToken.save();
          const isProduction = process.env.NODE_ENV === "production";
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
          });
          sendJsonResponse(res, 200, {
            username: user.username,
            role: user.role,
          });

          await SystemLog.create({
            level: "info",
            source: "authentication",
            category: "authentication",
            message: "Admin login successful.",
            initiated_by: user.username,
          });
        } catch (err) {
          console.error(
            `${this.loginAdmin.name} save refresh token error: ${err}\n${err.stack}`,
          );
          logError(err);
          sendJsonResponse(res, 500);
          await SystemLog.create({
            level: "error",
            source: "authentication",
            category: "authentication",
            message: "Admin login failed.",
            initiated_by: user.username,
          });
          next(err);
        }
      },
    );
  };

  getAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "super admin") {
      res.sendStatus(403);
      return;
    }

    const id = String(req.query.id);

    if (!id) {
      sendJsonResponse(res, 400, "no id provided");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendJsonResponse(res, 400, "invalid id");
      return;
    }

    try {
      const admin: UserDocument = await User.findById(id);
      if (admin === null) {
        sendJsonResponse(res, 404, `no user with id ${id}`);
      } else {
        sendJsonResponse(res, 200, {
          _id: admin._id,
          role: admin.role,
          email: admin.email,
          username: admin.username,
          firstName: admin.firstName,
          lastName: admin.lastName,
        });
      }
    } catch (err) {
      console.error(`${this.getAdmin.name} User.findByID error:`);
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

  updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "super admin") {
      res.sendStatus(403);
      return;
    }
    const id = String(req.query.id);
    console.log("from updateAdmin");
    console.log("id value: ", id);

    const editedAdminDetails: UserType = req.body;

    if (!id) {
      sendJsonResponse(res, 400, "no id included");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendJsonResponse(res, 400, "invalid id");
      return;
    }

    const [userIdExists, userIdErr] = await doesUserIdExist(id);
    if (userIdErr !== null) {
      console.error(`${this.updateAdmin.name} doesUserIdExist error`);
      logError(userIdErr);
      sendJsonResponse(res, 500);
      next(userIdErr);
      return;
    } else if (!userIdExists) {
      sendJsonResponse(res, 404, `no user with id ${id}`);
      return;
    }

    if (
      !editedAdminDetails.role ||
      !editedAdminDetails.username ||
      !editedAdminDetails.email ||
      !editedAdminDetails.firstName ||
      !editedAdminDetails.lastName
    ) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    // FIX: This triggers when username/email
    // are not changed
    //
    // const [usernameExists, emailExists, userExistsErr] = await doesUserExist(
    //   editedAdminDetails.username,
    //   editedAdminDetails.email,
    // );
    // if (userExistsErr !== null) {
    //   next(userExistsErr);
    //   sendJsonResponse(res, 500);
    //   return;
    // }
    //
    // if (usernameExists) {
    //   sendJsonResponse(res, 409, "username is already taken");
    //   return;
    // }
    //
    // if (emailExists) {
    //   sendJsonResponse(res, 409, "email is already taken");
    //   return;
    // }

    try {
      const updatedAdmin: UserDocument = await User.findByIdAndUpdate(
        id,
        editedAdminDetails,
        { new: true },
      );
      sendJsonResponse(res, 201, {
        _id: updatedAdmin._id,
        role: updatedAdmin.role,
        email: updatedAdmin.email,
        username: updatedAdmin.username,
        firstName: updatedAdmin.firstName,
        lastName: updatedAdmin.lastName,
      });

      await SystemLog.create({
        level: "info",
        source: "admin-panel",
        category: "admin-management",
        message: "Admin profile update successful.",
        initiated_by: req.user.username,
        data: {
          role: updatedAdmin.role,
          email: updatedAdmin.email,
          username: updatedAdmin.username,
          firstName: updatedAdmin.firstName,
          lastName: updatedAdmin.lastName,
        },
      });
    } catch (err) {
      console.error(`${this.updateAdmin.name} User.findByIdandUpdate error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "admin-panel",
        category: "admin-management",
        message: "Admin profile update failed.",
        initiated_by: req.user.username,
        data: {
          error: err,
        },
      });
      next(err);
    }
  };

  // NOTE: For creating a user in web app
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== "super admin" && req.user.role !== "admin") {
      res.sendStatus(403);
      return;
    }

    const allChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+|}{[]:;?><,./-=";
    const passwordLength = 10;
    let generatedPassword = "";

    const user: UserType = req.body;
    const saltRounds = 10;
    if (!user.email || !user.username || !user.firstName || !user.lastName) {
      sendJsonResponse(res, 400, "provide all fields");
      return;
    }

    const [usernameExists, emailExists, userExistsErr] = await doesUserExist(
      user.username,
      user.email,
    );
    if (userExistsErr !== null) {
      next(userExistsErr);
      sendJsonResponse(res, 500);
      return;
    }

    if (usernameExists) {
      sendJsonResponse(res, 409, "username is already taken");
      return;
    }

    if (emailExists) {
      sendJsonResponse(res, 409, "email is already taken");
      return;
    }

    const bytes = randomBytes(passwordLength);
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = bytes[i] % allChars.length;
      generatedPassword += allChars[randomIndex];
    }

    bcrypt.hash(
      generatedPassword,
      saltRounds,
      async (error: Error, hashed: string) => {
        if (error) {
          console.error(`${this.createUser.name} bcrypt.hash error`);
          logError(error);
          sendJsonResponse(res, 500);
          next(error);
          return;
        }
        const newUser: UserDocument = new User({
          verified: false,
          role: DOCTOR_ROLE,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          password: hashed,
        });

        try {
          const result = await newUser.save();

          sendJsonResponse(res, 201, result);

          sendEmail({
            from: FROM_EMAIL,
            to: result.email,
            subject: "Account Created - MedTalk",
            text: `An account has been created on your email. Here are your credentials when logging in:\nEmail: ${result.email}\nPassword: ${generatedPassword}\nDo not forget to change your password after first log in.`,
            html: `<p>An account has been created on your email. Here are your credentials when logging in:<br><br>Email: ${result.email}<br>Password: ${generatedPassword}<br><br>Do not forget to change your password after your first log in.</p>`,
          });

          await SystemLog.create({
            level: "info",
            source: "admin-panel",
            category: "user-management",
            message: "User creation successful.",
            initiated_by: req.user.username,
            data: {
              email: result.email,
              username: result.username,
            },
          });
        } catch (err) {
          console.error(`${this.createUser.name} newUser.save error`);
          logError(err);
          sendJsonResponse(res, 500);
          await SystemLog.create({
            level: "error",
            source: "admin-panel",
            category: "user-management",
            message: "User creation successful.",
            initiated_by: req.user.username,
            data: {
              error: err,
            },
          });
          next(err);
        }
      },
    );
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.query.id);
      const editedUserDetails: UserType = req.body;

      if (!id) {
        sendJsonResponse(res, 400, "no id included");
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        sendJsonResponse(res, 400, "invalid id");
        return;
      }

      if (editedUserDetails.email || editedUserDetails.username) {
        const [usernameExists, emailExists, userExistsErr] =
          await doesUserExist(
            editedUserDetails.username,
            editedUserDetails.email,
          );
        if (userExistsErr !== null) {
          throw userExistsErr;
        }

        if (editedUserDetails.username) {
          if (usernameExists) {
            sendJsonResponse(res, 409, "username is already taken");
            return;
          }
        }

        if (editedUserDetails.email) {
          if (emailExists) {
            sendJsonResponse(res, 409, "email is already taken");
            return;
          }
        }
      }

      const [userIdExists, userIdErr] = await doesUserIdExist(id);
      if (userIdErr !== null) {
        throw userIdErr;
      } else if (!userIdExists) {
        sendJsonResponse(res, 404, `no user with id ${id}`);
        return;
      }

      const updatedUser: UserDocument = await User.findByIdAndUpdate(
        id,
        editedUserDetails,
        { new: true },
      );
      sendJsonResponse(res, 201, {
        _id: String(updatedUser._id),
        role: updatedUser.role,
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      });

      await SystemLog.create({
        level: "info",
        source: "admin-panel",
        category: "user-management",
        message: "User update profile successful.",
        initiated_by: req.user.username,
      });
    } catch (err) {
      console.error(`${this.updateUser.name} User.findByIdandUpdate error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "admin-panel",
        category: "user-management",
        message: "User update profile failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
      next(err);
    } finally {
      return;
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id: string = String(req.query.id);

    if (!id) {
      sendJsonResponse(res, 400, "no id included");
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendJsonResponse(res, 400, "invalid id");
    }

    try {
      const [userIdExists, userIdErr] = await doesUserIdExist(id);
      if (userIdErr !== null) {
        throw userIdErr;
      } else if (!userIdExists) {
        sendJsonResponse(res, 404, `no user with id ${id}`);
        return;
      }
    } catch (err) {
      console.error(`${this.deleteUser.name} doesUserIdExist error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "admin-management",
        category: "user-management",
        message: "User account deletion failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
      next(err);
      return;
    }

    try {
      const result = await User.findByIdAndDelete(id);
      sendJsonResponse(res, 200, result);

      await SystemLog.create({
        level: "info",
        source: "admin-management",
        category: "user-management",
        message: "User account deletion successful.",
        initiated_by: req.user.username,
      });
    } catch (err) {
      console.error(`${this.deleteUser.name} User.findByIdAndDelete error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "admin-management",
        category: "user-management",
        message: "User account deletion failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
      next(err);
    }
  };

  deleteUsers = async (req: Request, res: Response, next: NextFunction) => {
    const idList = req.body;

    if (!idList || !Array.isArray(idList) || idList.length === 0) {
      sendJsonResponse(res, 400, "No IDs provided");
      return;
    }

    try {
      const objectIds = idList.map((id) => new mongoose.Types.ObjectId(id));
      const result = await User.deleteMany({ _id: { $in: objectIds } });
      sendJsonResponse(res, 200, result);

      await SystemLog.create({
        level: "info",
        source: "admin-management",
        category: "user-management",
        message: "User batch account deletion successful.",
        initiated_by: req.user.username,
      });
    } catch (err) {
      console.error(`${this.deleteUsers.name} error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "admin-management",
        category: "user-management",
        message: "User batch account deletion failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
      next(err);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const saltRounds = 10;
    const userID = req.user.id;
    if (!req.body.password) {
      sendJsonResponse(res, 400, "No password given.");
      return;
    }

    const newPassword = String(req.body.password);

    try {
      bcrypt.hash(
        newPassword,
        saltRounds,
        async (error: Error, hashed: string) => {
          if (error) {
            throw error;
          }
          const result = await User.findByIdAndUpdate(
            userID,
            { password: hashed },
            { new: true },
          );

          sendJsonResponse(res, 201, result);
          await SystemLog.create({
            level: "info",
            source: "password-change",
            category: "user-management",
            message: "User change password successful.",
            initiated_by: req.user.username,
          });
        },
      );
    } catch (err) {
      console.error(`${this.changePassword.name} updating password error`);
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "info",
        source: "password-change",
        category: "user-management",
        message: "User change password failed.",
        initiated_by: req.user.username,
        data: { ...err },
      });
      next(err);
      return;
    }
  };

  requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email } = req.body as { email?: string };
      if (!email) {
        sendJsonResponse(res, 400, "No email provided");
        return;
      }

      const [user, userErr] = await fetchUserByEmail(email);

      if (userErr) throw userErr;

      // For privacy, always respond success even if not found
      if (!user) {
        sendJsonResponse(res, 200);
        return;
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

      await PasswordResetToken.create({
        userId: user._id,
        token,
        expiresAt,
        used: false,
      });

      const baseUrl = process.env.BASE_URL || "http://localhost:5173";
      const resetLink = `${baseUrl}/reset-password?token=${token}`;

      await sendEmail({
        from: FROM_EMAIL,
        to: user.email,
        subject: "Reset your MedTalk password",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `<p>You requested a password reset.</p><p>Click <a href="${resetLink}">here</a> to set a new password. This link expires in 30 minutes.</p>`,
      });

      sendJsonResponse(res, 200);

      await SystemLog.create({
        level: "info",
        source: "password-reset",
        category: "authentication",
        message: "Password reset email sent",
        data: { email: user.email },
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "password-reset",
        category: "authentication",
        message: "Request password reset failed.",
        data: { ...err },
      });
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body as {
        token?: string;
        password?: string;
      };
      if (!token || !password) {
        sendJsonResponse(res, 400, "Missing token or password");
        return;
      }

      const prt = await PasswordResetToken.findOne({ token });
      if (!prt || prt.used || prt.expiresAt < new Date()) {
        sendJsonResponse(res, 400, "Invalid or expired token");
        return;
      }

      const saltRounds = 10;
      bcrypt.hash(
        password,
        saltRounds,
        async (error: Error, hashed: string) => {
          if (error) {
            logError(error);
            sendJsonResponse(res, 500);
            next(error);
            return;
          }

          await User.findByIdAndUpdate(prt.userId, { password: hashed });
          prt.used = true;
          await prt.save();

          sendJsonResponse(res, 200);

          await SystemLog.create({
            level: "info",
            source: "password-reset",
            category: "authentication",
            message: "Password reset successful",
            data: { userId: prt.userId },
          });
        },
      );
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "password-reset",
        category: "authentication",
        message: "Password reset failed",
        data: { ...err },
      });
      next(err);
    }
  };
}
