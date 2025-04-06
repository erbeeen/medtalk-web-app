import User, { UserDocument } from "../models/user.model.js";
import bcrypt from "bcrypt";

//export async function doesUserExist(username: string): Promise<boolean | null> {
//  try {
//    const user: Document = await User.findOne({ username });
//    if (user) {
//      return true;
//    }
//    return false;
//  } catch (err: any) {
//    console.error(`doesUserExist error: ${err}`);
//    return null;
//  }
//}

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

export async function fetchUserByName(
  username: string,
): Promise<[UserDocument | null, Error | null]> {
  try {
    const user: UserDocument = await User.findOne({ username: username });
    return [user, null];
  } catch (err) {
    return [null, err];
  }
}

export function hashPassword(password: string): [string | null, Error | null] {
  const saltRounds: number = 10;
  bcrypt.hash(password, saltRounds, (err: Error, hashedPassword: string) => {
    if (err) {
      return [null, err];
    }

    return [hashedPassword, null];
  });
  return [null, new Error("bcrypt.hash was not called")];
}

export function comparePassword(
  password: string,
  hashedPassword: string,
): [boolean | null, Error | null] {
  bcrypt.compare(password, hashedPassword, (err: Error, result: boolean) => {
    if (err) {
      return [null, err];
    }
    return [result, null];
  });
  return [null, new Error("bcrypt.compare did not function")];
}
