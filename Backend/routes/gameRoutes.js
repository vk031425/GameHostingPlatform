const express = require("express");
const Game = require("../models/Game");
const verifyUser = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalauth");
const User = require("../models/User");

module.exports = () => {
  const router = express.Router();

  // GET single game by slug
  router.get("/games/:slug", optionalAuth, async (req, res) => {
    try {
      const { slug } = req.params;

      const game = await Game.findOne({
        slug,
        status: "approved",
      }).populate("developer", "username fullName");

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      let userRating = 0;

      if (req.user && game.userRatings?.length > 0) {
        const found = game.userRatings.find(
          (r) => r.user.toString() === req.user.id,
        );

        if (found) {
          userRating = found.rating;
        }
      }

      res.status(200).json({
        ...game.toObject(),
        userRating,
      });
    } catch (err) {
      console.error("Error fetching game:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/games/:id/view", async (req, res) => {
    try {
      await Game.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 },
      });

      res.json({ message: "View counted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/games/:id/engagement", verifyUser, async (req, res) => {
    try {
      const gameId = req.params.id;

      await Game.findByIdAndUpdate(gameId, {
        $inc: { engagements: 1 },
      });

      await User.findByIdAndUpdate(req.user.id, {
        $inc: { gamesPlayed: 1 },
        $addToSet: { recentlyPlayed: gameId },
      });

      res.json({ message: "Play counted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/games/:id/favorite", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const exists = user.favoriteGames.includes(req.params.id);

      if (exists) {
        user.favoriteGames.pull(req.params.id);
      } else {
        user.favoriteGames.push(req.params.id);
      }

      await user.save();

      res.json({ favoriteGames: user.favoriteGames });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/games/:id/wishlist", verifyUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      const exists = user.wishlist.includes(req.params.id);

      if (exists) {
        user.wishlist.pull(req.params.id);
      } else {
        user.wishlist.push(req.params.id);
      }

      await user.save();

      res.json({ wishlist: user.wishlist });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/games/:id/rate", verifyUser, async (req, res) => {
    try {
      const { rating } = req.body;
      const userId = req.user.id;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating value" });
      }

      const game = await Game.findById(req.params.id);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      // Find if user already rated
      const existingRating = game.userRatings.find(
        (r) => r.user.toString() === userId,
      );

      if (existingRating) {
        // User is updating rating
        const oldRating = existingRating.rating;

        if (oldRating !== rating) {
          // Decrease old count
          game.totalRatings[oldRating - 1] -= 1;

          // Increase new count
          game.totalRatings[rating - 1] += 1;

          existingRating.rating = rating;
        }
      } else {
        // First time rating
        game.totalRatings[rating - 1] += 1;

        game.userRatings.push({
          user: userId,
          rating,
        });

        await User.findByIdAndUpdate(userId, {
          $inc: { reviewsPosted: 1 },
        });
      }

      // Recalculate average
      const totalVotes = game.totalRatings.reduce((a, b) => a + b, 0);

      const weightedSum = game.totalRatings.reduce(
        (sum, count, index) => sum + count * (index + 1),
        0,
      );

      game.rating = totalVotes > 0 ? weightedSum / totalVotes : 0;

      await game.save();

      res.json({
        rating: game.rating,
        totalRatings: game.totalRatings,
        userRating: rating,
      });
    } catch (err) {
      console.error("RATE ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
