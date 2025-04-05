import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export async function doesUserExist(username: string): Promise<boolean | null> {
  try {
    const user = await User.findOne({ username });
    if (user) {
      return true;
    }
    return false;
  } catch (err: Error | any) {
    console.error(`doesUserExist: ${err.message}`);
    return null;
  }
}

export function hashPassword(password: string): String {
  const saltRounds: number = 10;
  bcrypt.hash(password, saltRounds, (err: Error, hash: String) => {
    if (err) {
      console.error(`hashPassword: ${err}`);
      return "";
    }

    return hash;
  })
  return "";
}
