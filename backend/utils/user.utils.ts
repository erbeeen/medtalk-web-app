import User, { UserDocument } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function doesUserExist(
  username: string,
): Promise<[boolean | null, Error | null]> {
  try {
    const user: UserDocument = await User.findOne({ username });
    if (user) {
      return [true, null];
    }
    return [false, null];
  } catch (err) {
    return [null, err];
  }
}

export async function doesUserIdExist(
  id: string,
): Promise<[boolean | null, Error | null]> {
  try {
    const user: UserDocument = await User.findById(id);
    if (user === null) {
      return [false, null];
    }
    return [true, null];
  } catch (err) {
    return [null, err];
  }
}

export async function fetchUserByName(
  username: string,
): Promise<[UserDocument | null, Error | null]> {
  try {
    const user: UserDocument = await User.findOne({ username });

    return [user, null];
  } catch (err) {
    return [null, err];
  }
}

export function createUserAuthToken(
  id: string,
  email: string,
): [string | null, Error | null] {
  try {
    const token = jwt.sign(
      {
        id: id,
        email: email,
      },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: "14d" },
    );
    return [token, null];
  } catch (err) {
    return [null, err];
  }
}
