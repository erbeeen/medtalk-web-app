import mongoose from "mongoose";

export type UserType = {
  _id?: mongoose.Types.ObjectId | string;
  verified: boolean;
  role: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
};

export type UserDocument = UserType & mongoose.Document;

const userSchema = new mongoose.Schema({
  verified: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});
userSchema.set("timestamps", true);

const User = mongoose.model("users", userSchema);

export default User;
