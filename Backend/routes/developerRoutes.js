const express = require("express");
const Game = require("../models/Game");
const verifyuser = require("../middlewares/auth");

module.exports = () => {
  const router = express.Router();

  // ==============================
  // GET Developer Overview Stats
  // ==============================
  router.get("/developer/overview", verifyuser, async (req, res) => {
    try {
      const developerId = req.user.id;

      const games = await Game.find({ developer: developerId });

      let totalGames = games.length;
      let totalViews = 0;
      let totalPlays = 0;
      let totalDownloads = 0;
      let totalRevenue = 0;
      let totalRatingSum = 0;
      let totalRatingCount = 0;

      games.forEach((game) => {
        totalViews += game.views || 0;
        totalPlays += game.plays || 0;
        totalDownloads += game.downloads || 0;
        totalRevenue += game.revenue || 0;

        if (game.userRatings?.length > 0) {
          game.userRatings.forEach((r) => {
            totalRatingSum += r.rating;
            totalRatingCount++;
          });
        }
      });

      const avgRating =
        totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;

      // 🔥 Fetch Recent Uploads (Last 5)
      const recentGames = await Game.find({ developer: developerId })
        .sort({ createdAt: -1 }) // newest first
        .limit(4)
        .select("_id title slug thumbnailUrl views rating isPremium");

      res.status(200).json({
        totalGames,
        totalViews,
        totalPlays,
        totalDownloads,
        totalRevenue,
        avgRating,
        recentGames, 
      });
    } catch (err) {
      console.error("Developer overview error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/developer/mygames", verifyuser, async (req, res) => {
    try {
      const developerId = req.user.id;

      const games = await Game.find({ developer: developerId })
        .sort({ createdAt: -1 })
        .select("_id title slug thumbnailUrl version status views plays");

      res.status(200).json(games);
    } catch (err) {
      console.error("Error fetching developer games:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.delete("/developer/game/:id", verifyuser, async (req, res) => {
    try {
      const developerId = req.user.id;
      const gameId = req.params.id;

      const game = await Game.findById(gameId);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      // Ownership check
      if (game.developer.toString() !== developerId.toString()) {
        return res.status(403).json({
          message: "Unauthorized: You cannot delete this game",
        });
      }

      await Game.findByIdAndDelete(gameId);

      res.status(200).json({ message: "Game deleted successfully" });
    } catch (err) {
      console.error("Error deleting game:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/developer/game/:id", verifyuser, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.developer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      res.json({
        title: game.title,
        shortDescription: game.shortDescription,
        description: game.description,
        trailerUrl: game.trailerUrl,
        categories: game.categories,
        isPremium: game.isPremium,
        price: game.price,
        version: game.version,
        thumbnailUrl: game.thumbnailUrl,
        screenshots: game.screenshots,
        distributionType: game.distributionType,
      });
    } catch (err) {
      console.error("Fetch game error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.put("/developer/game/:id", verifyuser, async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.developer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const {
        title,
        shortDescription,
        description,
        trailerUrl,
        categories,
        isPremium,
        price,
      } = req.body;

      // Update only allowed fields
      game.title = title ?? game.title;
      game.shortDescription = shortDescription ?? game.shortDescription;
      game.description = description ?? game.description;
      game.trailerUrl = trailerUrl ?? game.trailerUrl;
      game.categories = categories ?? game.categories;
      game.isPremium = isPremium ?? game.isPremium;
      game.price = isPremium ? price : 0;

      await game.save();

      res.json({ message: "Game updated successfully" });
    } catch (err) {
      console.error("Update game error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
