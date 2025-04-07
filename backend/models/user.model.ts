import mongoose from "mongoose";

export type UserType = {
  id?: string;
  role: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
};

export type UserDocument = UserType & mongoose.Document;

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
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
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

const User = mongoose.model("users", userSchema);

export default User;
