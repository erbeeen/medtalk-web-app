const express = require("express");
const dotenv = require("dotenv");
const path  = require("path");
const cors = require("cors");
const { dbConnect } = require("./config/db");
const { userRouter } = require("./routes/user.route");
dotenv.config()

const app = express();
const PORT = process.env.PORT;
//const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname + "/frontend/dist")));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, async () => {
  await dbConnect();
  console.log("Backend server running");
})
