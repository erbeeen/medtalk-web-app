import mongoose from "mongoose";

export type UserType = {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
};

export type UserDocument = UserType & mongoose.Document;

const userSchema = new mongoose.Schema({
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
