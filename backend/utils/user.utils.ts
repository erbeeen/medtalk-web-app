import User, { UserDocument, UserModel } from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export async function doesUserExist(username: string): Promise<boolean | null> {
  try {
    const user: Document = await User.findOne({ username });
    if (user) {
      return true;
    }
    return false;
  } catch (err: Error | any) {
    console.error(`doesUserExist: ${err}`);
    return null;
  }
}

export function hashPassword(password: string): string {
  const saltRounds: number = 10;
  bcrypt.hash(password, saltRounds, (err: Error, hashedPassword: string) => {
    if (err) {
      console.error(`hashPassword: ${err}`);
      return "";
    }

    return hashedPassword;
  });
  return "";
}

export async function fetchUserById(id: string): Promise<UserDocument | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  try {
    const result: UserDocument = await User.findById(id);
    return result;
  } catch (err: Error | any) {
    console.error(`fetchUser: ${err}`);
    return null;
  }
}

export async function fetchUserByName(
  username: string,
): Promise<UserDocument | null> {
  try {
    const user: UserDocument = await User.findOne({username: username});
    return user;
  } catch (err: Error|any) {
    console.error(`fetchUserByName: ${err}`);
    return null;
  }
}

