import User from "../models/user.model";

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
