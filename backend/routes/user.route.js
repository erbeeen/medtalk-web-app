const express = require("express");
const cors = require("cors");
const { User } = require("../models/user.model");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();
userRouter.use(cors());

userRouter.post("/", userController.registerUser); 

module.exports = { userRouter };
