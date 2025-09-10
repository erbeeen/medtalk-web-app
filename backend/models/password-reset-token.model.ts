import mongoose from "mongoose";

export type PasswordResetTokenType = {
  userId: mongoose.Types.ObjectId | string;
  token: string;
  expiresAt: Date;
  used?: boolean;
};

export type PasswordResetTokenDocument = PasswordResetTokenType & mongoose.Document;

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  token: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

passwordResetTokenSchema.set("timestamps", true);

const PasswordResetToken = mongoose.model("password_reset_tokens", passwordResetTokenSchema);

export default PasswordResetToken;


