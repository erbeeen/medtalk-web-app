import path from "path";
import express, { json, static as static_ } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db.js";
import userRouter from "./routes/user.route.js";
import { fileURLToPath } from "url";
dotenv.config()

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT;

app.use(json());
app.use(cors());
app.use("/api/users", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(static_(path.join(__dirname + "/frontend/dist")));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, async () => {
  await dbConnect();
  console.log("Backend server running");
})
