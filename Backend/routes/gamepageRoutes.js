const express = require("express");
const Game = require("../models/Game");

module.exports = () => {
  const router = express.Router();

  /*
  =====================================
  GET: Feed Games (Lightweight Cards)
  =====================================
  Supports:
  ?category=
  ?search=
  ?sort=
  ?page=
  ?limit=
  */

  router.get("/games", async (req, res) => {
    try {
      const { category, search, sort, page = 1, limit = 12 } = req.query;
      // console.log(category, search, sort, page, limit);

      let filter = {
        status: "approved", // Only show approved games
      };

      // Category filter (array field)
      if (category && category !== "All") {
        filter.categories = { $in: [category] };
      }

      // Search filter
      if (search) {
        filter.title = { $regex: search, $options: "i" };
      }

      // Sorting logic
      let sortOption = { createdAt: -1 }; // Default = New

      if (sort === "popular") {
        sortOption = { views: -1 };
      }

      if (sort === "toprated") {
        sortOption = { rating: -1 };
      }

      const games = await Game.find(filter)
        .select("_id slug title thumbnailUrl rating views isPremium categories")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Game.countDocuments(filter);

      res.status(200).json({
        games,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        total,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};