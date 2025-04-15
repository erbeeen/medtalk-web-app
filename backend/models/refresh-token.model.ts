import mongoose from "mongoose";

export type RefreshTokenType = {
  token: string;
};

export type RefreshTokenDocument = RefreshTokenType & mongoose.Document;

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    trim: true,
  }
});

const RefreshToken = mongoose.model("auth_tokens", refreshTokenSchema);

export default RefreshToken;
