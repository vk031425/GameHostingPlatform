const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyUser = require("../middlewares/auth");

module.exports = () => {
  const router = express.Router();

  // SIGNUP
  router.post("/user/signup", async (req, res) => {
    try {
      const { fullName, username, email, password } = req.body;

      if (!fullName || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate username format
      const usernameRegex = /^[a-z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          message:
            "Username can only contain lowercase letters, numbers and underscore",
        });
      }

      // Check existing email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Check existing username
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName,
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "Account created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // SIGNIN (Email OR Username)
  router.post("/user/signin", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      // identifier = email OR username

      if (!identifier || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      // Find user by email OR username
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (user.isBlocked) {
        return res.status(403).json({ message: "Account is blocked" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      // Store in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
          profilepic: user.profilepic,
          recentlyPlayed: user.recentlyPlayed,
          purchasedGames: user.purchasedGames,
          favoriteGames: user.favoriteGames,
          wishlist: user.wishlist,
          gamesPlayed: user.gamesPlayed,
          reviewsPosted: user.reviewsPosted,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // LOGOUT
  router.post("/user/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  //verifyuser route
  router.get("/user/verify", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
