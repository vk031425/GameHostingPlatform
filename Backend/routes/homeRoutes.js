const express = require("express");
const Game = require("../models/Game");

module.exports = () => {
  const router = express.Router();

  // GET Homepage Data
  router.get("/home", async (req, res) => {
    try {
      // Featured Games
      const featuredGames = await Game.find({
        status: "approved",
        isFeatured: true,
      })
        .select("_id slug title thumbnailUrl rating views isPremium")
        .limit(4)
        .sort({ createdAt: -1 });

      // Trending Games (based on views)
      const trendingGames = await Game.find({
        status: "approved",
      })
        .select("_id slug title thumbnailUrl rating views isPremium")
        .sort({ views: -1 })
        .limit(4);

      res.status(200).json({
        featuredGames,
        trendingGames,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};