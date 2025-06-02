import jwt from "jsonwebtoken";

interface CustomJwtPayload extends jwt.JwtPayload {
  id?: string;
  username?: string;
  role?: string;
}

export function generateAccessToken(
  id: string,
  username: string,
  role: string,
): [string | null, Error | null] {
  try {
    const token = jwt.sign(
      {
        id: id,
        username: username,
        role: role,
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
  role: string,
): [string | null, Error | null] {
  try {
    const token = jwt.sign(
      {
        id: id,
        username: username,
        role: role,
      },
      process.env.SECRET_REFRESH_TOKEN,
    );
    return [token, null];
  } catch (err) {
    return [null, err];
  }
}

export async function refreshAccessToken(
  token: string,
): Promise<[string | null, boolean, Error | null]> {
  try {
    const user: CustomJwtPayload = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
        if (err) {
          console.log("\nrefreshAccessToken jwt.verify err: ", err);
          return reject(err);
        }
        resolve(decoded as CustomJwtPayload);
      });
    });

    const [accessToken, accessTokenErr] = generateAccessToken(
      user.id,
      user.username,
      user.role,
    );

    if (accessTokenErr) {
      console.log(
        "\nrefreshAccessToken generateAccessToken error: ",
        accessTokenErr,
      );
    }

    return [accessToken, true, null];
  } catch (err) {
    console.log("refreshAccessToken caught error: ", err);
    return [null, false, err];
  }

  // jwt.verify(
  //   token,
  //   process.env.SECRET_REFRESH_TOKEN,
  //   (err, user: CustomJwtPayload) => {
  //     if (err) {
  //       console.log("\nrefreshAccessToken jwt.verify err: ", err);
  //       return [null, false, null];
  //     }
  //     const [accessToken, accessTokenErr] = generateAccessToken(
  //       user.id,
  //       user.username,
  //       user.role,
  //     );
  //     if (accessTokenErr) {
  //       return [null, false, accessTokenErr];
  //     }
  //     return [accessToken, true, null];
  //   },
  // );
  // return ["", false, Error("refreshAccessToken jwt.verify did not function")];
}

export async function validateRefreshToken(
  token: string,
): Promise<[boolean | null, Error | null]> {
  try {
    const isTokenValid: boolean = await new Promise((resolve, _reject) => {
      jwt.verify(
        token,
        process.env.SECRET_REFRESH_TOKEN,
        (err, _user: CustomJwtPayload) => {
          if (err) {
            resolve(false);
          }
          resolve(true);
        },
      );
    });
    return [isTokenValid, null];
  } catch (err) {
    console.log("validateRefreshToken caught error: ", err);
    return [null, err];
  }
}
