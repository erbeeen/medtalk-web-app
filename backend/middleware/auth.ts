import jwt from "jsonwebtoken";

export function createToken(id: string, email: string): [string|null, Error|null] {
  try {
    const token = jwt.sign(
      {
        id: id,
        email: email,
        iat: Math.floor(Date.now() / 10000)
      },
      process.env.SECRET_STRING,
      { expiresIn: "14d" },
    );
    return [token, null];
  } catch (err) {
    return [null, err];
  } 
}
