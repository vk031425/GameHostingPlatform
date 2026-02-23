const express = require("express");
const Game = require("../models/Game");

module.exports = () => {
  const router = express.Router();

  // GET single game by slug
  router.get("/games/:slug", async (req, res) => {
    try {
      const { slug } = req.params;

      const game = await Game.findOne({ slug, status: "approved" })
        .populate("developer", "username fullName");

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      res.status(200).json(game);
    } catch (err) {
      console.error("Error fetching game:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};