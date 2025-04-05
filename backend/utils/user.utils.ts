import User, { UserDocument } from "../models/user.model.js";
import bcrypt from "bcrypt";

export async function doesUserExist(username: string): Promise<boolean | null> {
  try {
    const user: Document = await User.findOne({ username });
    if (user) {
      return true;
    }
    return false;
  } catch (err: any) {
    console.error(`doesUserExist error: ${err}`);
    return null;
  }
}

export async function fetchUserByName(
  username: string,
): Promise<UserDocument | null> {
  const user: UserDocument = await User.findOne({ username: username });
  return user;
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

export function comparePassword(
  password: string,
  hashedPassword: string,
): boolean|Error|null {
  bcrypt.compare(
    password,
    hashedPassword,
    (err: Error, result: boolean) => {
      if (err) {
        return err;
      }
      return result;
    },
  );
  return null;
}
