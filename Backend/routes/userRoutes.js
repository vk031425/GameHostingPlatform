const express = require("express");
const User = require("../models/User");
const Game = require("../models/Game");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyUser = require("../middlewares/auth");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../config/r2");

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
        secure: true, // true in production (HTTPS)
        sameSite: "None",
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
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
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

  router.get("/user/favorites", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const games = await Game.find({
        _id: { $in: user.favoriteGames },
        status: "approved",
      })
        .sort({ createdAt: -1 })
        .select("_id slug title thumbnailUrl rating views isPremium");

      res.status(200).json({ games });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/user/wishlist", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const games = await Game.find({
        _id: { $in: user.wishlist },
        status: "approved",
      })
        .sort({ createdAt: -1 })
        .select("_id slug title thumbnailUrl rating views isPremium");

      res.status(200).json({ games });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.get("/user/purchasedgames", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const games = await Game.find({
        _id: { $in: user.purchasedGames },
        status: "approved",
      })
        .sort({ createdAt: -1 })
        .select("_id slug title thumbnailUrl rating views isPremium");

      res.status(200).json({ games });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Remove from favorites
  router.put("/user/favorites/remove/:gameId", verifyUser, async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { favoriteGames: req.params.gameId },
    });

    res.json({ success: true });
  });

  router.put("/user/wishlist/remove/:gameId", verifyUser, async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { wishlist: req.params.gameId },
    });

    res.json({ success: true });
  });

  router.get("/user/overview", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select(
          "gamesPlayed reviewsPosted purchasedGames createdAt recentlyPlayed favoriteGames wishlist",
        )
        .populate({
          path: "recentlyPlayed",
          select: "slug title thumbnailUrl rating views isPremium",
          options: { limit: 5, sort: { createdAt: -1 } },
        })
        .populate({
          path: "favoriteGames",
          select: "slug title thumbnailUrl rating views isPremium",
          options: { limit: 5 },
        })
        .populate({
          path: "wishlist",
          select: "slug title thumbnailUrl rating views isPremium",
          options: { limit: 5 },
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        stats: {
          gamesPlayed: user.gamesPlayed,
          reviewsPosted: user.reviewsPosted,
          purchasedCount: user.purchasedGames.length,
          joinedAt: user.createdAt,
        },
        recentlyPlayed: user.recentlyPlayed,
        favorites: user.favoriteGames,
        wishlist: user.wishlist,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load overview" });
    }
  });

  router.post(
    "/user/profile-pic/get-upload-url",
    verifyUser,
    async (req, res) => {
      try {
        const { fileType } = req.body;

        if (!fileType) {
          return res.status(400).json({ message: "File type required" });
        }

        const fileExtension = fileType.split("/")[1];

        const fileKey = `users/${req.user.id}/profile-${Date.now()}.${fileExtension}`;

        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: fileKey,
          ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(r2, command, {
          expiresIn: 60 * 5, // 5 minutes
        });

        res.json({ uploadUrl, fileKey });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate upload URL" });
      }
    },
  );

  router.post(
    "/user/profile-pic/confirm-upload",
    verifyUser,
    async (req, res) => {
      try {
        const { fileKey } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Optional: store old profile pic for deletion later
        const oldProfilePic = user.profilepic;

        user.profilepic = fileKey;
        await user.save();

        res.json({
          message: "Profile picture updated successfully",
          profilepic: fileKey,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Profile confirmation failed" });
      }
    },
  );

  router.put("/user/profile/update", verifyUser, async (req, res) => {
    try {
      const { fullName } = req.body;

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fullName) {
        user.fullName = fullName.trim();
      }

      await user.save();

      res.json({
        message: "Profile updated successfully",
        user: {
          fullName: user.fullName,
          profilepic: user.profilepic,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Profile update failed" });
    }
  });

  router.put("/user/password/update", verifyUser, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields required" });
      }

      const user = await User.findById(req.user.id);

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Current password incorrect" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password too short" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Password update failed" });
    }
  });

  router.delete("/user/delete-account", verifyUser, async (req, res) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ message: "Password required" });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      await User.findByIdAndDelete(req.user.id);

      res.clearCookie("token");

      res.json({ message: "Account deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Account deletion failed" });
    }
  });

  return router;
};
