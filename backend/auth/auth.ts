import jwt from "jsonwebtoken";

interface CustomJwtPayload extends jwt.JwtPayload {
  id?: string;
  username?: string;
}

export function generateAccessToken(
  id: string,
  username: string,
): [string | null, Error | null] {
  try {
    const token = jwt.sign(
      {
        id: id,
        username: username,
      },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "30m" },
    );
    return [token, null];
  } catch (err) {
    return [null, err];
  }
}

export function generateRefreshToken(
  id: string,
  username: string,
): [string | null, Error | null] {
  try {
    const token = jwt.sign(
      {
        id: id,
        username: username,
      },
      process.env.SECRET_REFRESH_TOKEN,
    );
    return [token, null];
  } catch (err) {
    return [null, err];
  }
}

export function refreshAccessToken(
  token: string,
): [string | null, boolean, Error | null] {
  jwt.verify(
    token,
    process.env.SECRET_REFRESH_TOKEN,
    (err, user: CustomJwtPayload) => {
      if (err) {
        return [null, false, null];
      } else {
        const [accessToken, accessTokenErr] = generateAccessToken(
          user.id,
          user.username,
        );
        if (accessTokenErr) {
          return [null, false, accessTokenErr];
        }
        return [accessToken, true, null];
      }
    },
  );
  return ["", false, Error("jwt.verify did not function")];
}

export function validateRefreshToken(
  token: string,
): [boolean | null, Error | null] {
  jwt.verify(
    token,
    process.env.SECRET_REFRESH_TOKEN,
    (err, user: CustomJwtPayload) => {
      if (err) {
        return [false, null];
      }
      return [true, null];
    },
  );
  return [false, Error("jwt.verify did not run")];
}
