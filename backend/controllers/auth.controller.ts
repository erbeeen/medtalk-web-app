import jwt, { JwtPayload } from "jsonwebtoken";
import { refreshAccessToken, validateRefreshToken } from "../auth/auth.js";
import { logError } from "../middleware/logger.js";
import { NextFunction, Request, Response } from "express";
import RefreshToken from "../models/refresh-token.model.js";
import sendJsonResponse from "../utils/httpResponder.js";
import SystemLog from "../models/system-logs.model.js";

export default class AuthController {
  constructor() {}

  validateAccessToken = async (req: Request, res: Response) => {
    if (!req.user) {
      res.sendStatus(401);
      return;
    }
    sendJsonResponse(res, 200, {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    });
  };

  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (
        req.cookies.refreshToken === undefined &&
        req.body.token === undefined
      ) {
        res.sendStatus(401);
        return;
      }

      let refreshToken = req.cookies.refreshToken;
      if (refreshToken === undefined) refreshToken = req.body.token;

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

      // Decode the access token to get username and role
      const user = jwt.decode(accessToken) as JwtPayload;

      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      });

      sendJsonResponse(res, 201, {
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (
        req.cookies.refreshToken === undefined &&
        req.body.token === undefined
      ) {
        sendJsonResponse(res, 400, "provide refreshToken");
        return;
      }
      let refreshToken = req.cookies.refreshToken;
      if (refreshToken === undefined) {
        req.body.token;
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
        source: "authentication",
        category: "authentication",
        message: "User logout successful",
        initiated_by: req.user.username,
      });
    } catch (err) {
      logError(err);
      sendJsonResponse(res, 500);
      await SystemLog.create({
        level: "error",
        source: "authentication",
        category: "authentication",
        message: "User logout failed",
        initiated_by: req.user.username,
        data: { error: err },
      });
      next(err);
    }
  };
}
