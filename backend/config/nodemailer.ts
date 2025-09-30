import nodemailer from "nodemailer";
import { google } from "googleapis";
import { config } from "dotenv";

config();
const isProduction = process.env.NODE_ENV === "production";

const MAIL_USERNAME = process.env.MAIL_USERNAME;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

type sendEmailType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

declare module "nodemailer" {
  interface TransportOptions {
    component?: string | undefined;
    host?: string | undefined;
    port?: string | number | undefined;
    service?: string | undefined;
    auth?: object | string | undefined;
    secure?: boolean | undefined;
  }
}

export default async function sendEmail(mailOptions: sendEmailType) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: isProduction ? 465 : 587,
      secure: isProduction ? true : false,
      auth: {
        type: "OAuth2",
        user: MAIL_USERNAME,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const result = await transport.sendMail(mailOptions);
    console.log("Email sent: ", result.messageId);
  } catch (err) {
    console.error("Failed to send email: ", err);
  }
}
