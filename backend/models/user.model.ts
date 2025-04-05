import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("users", userSchema);

export interface UserInterface {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
};

export type UserDocument = UserInterface & mongoose.Document;
//export type UserModel = mongoose.Model<UserDocument>;
export default User;
