const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();

// Register a user
router.post("/register", async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user
    user = new User({ username, password, isAdmin });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, username: user.username, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
