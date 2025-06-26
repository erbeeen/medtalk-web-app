import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const isProduction = process.env.NODE_ENV === "production";

let transporterSingleton: null | Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = null;

export async function initializeTransporter() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: isProduction ? 465 : 587,
    secure: isProduction ? true : false,
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessToken: process.env.GOOGLE_ACCESS_TOKEN,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
  await transporter.verify()

  transporterSingleton = transporter;
}

export default async function getTransporter() {
  if (!transporterSingleton) {
    await initializeTransporter()
  }

  return transporterSingleton;
}
