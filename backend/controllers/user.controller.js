const { User } = require("../models/user.model");

async function registerUser(req, res) {
  const user = req.body;
  if (!user.firstName || !user.lastName || !user.username || !user.password) {
    return res.status(400).json({
      success: false,
      message: "provide all fields",
    });
  }

  const newUser = new User(user);

  try {
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    console.error("registerUser: Error in registering user:", err.message);
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

module.exports = {
  registerUser,
};
