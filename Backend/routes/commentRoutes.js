const express = require("express");
const Comment = require("../models/Comment");
const Game = require("../models/Game");
const verifyUser = require("../middlewares/auth");

module.exports = () => {
  const router = express.Router();

  /**
   * Get comments for a game
   */
  router.get("/comments/:gameId", async (req, res) => {
    try {
      const comments = await Comment.find({ game: req.params.gameId })
        .populate("user", "username profilepic")
        .sort({ createdAt: -1 });

      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  });

  /**
   * Post comment
   */
  router.post("/comments/:gameId", verifyUser, async (req, res) => {
    const { content, parent } = req.body;

    const newComment = new Comment({
      game: req.params.gameId,
      user: req.user.id,
      content,
      parent: parent || null,
    });

    await newComment.save();

    const populated = await newComment.populate("user", "username profilepic");

    res.status(201).json(populated);
  });

  router.post("/comments/:commentId/like", verifyUser, async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    const userId = req.user.id;

    const alreadyLiked = comment.likes.includes(userId);

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({ likes: comment.likes.length });
  });

  //edit comment
  router.put("/comments/:commentId", verifyUser, async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    comment.content = req.body.content;
    comment.isEdited = true;

    await comment.save();

    res.json(comment);
  });

  router.delete("/comments/:commentId", verifyUser, async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    comment.isDeleted = true;
    comment.content = "This comment has been deleted.";

    await comment.save();

    res.json({ message: "Deleted" });
  });

  router.post("/comments/:commentId/report", verifyUser, async (req, res) => {
    const { reason } = req.body;

    const comment = await Comment.findById(req.params.commentId);

    const alreadyReported = comment.reports.find(
      (r) => r.user.toString() === req.user.id,
    );

    if (alreadyReported)
      return res.status(400).json({ message: "Already reported" });

    comment.reports.push({
      user: req.user.id,
      reason,
    });

    await comment.save();

    res.json({ message: "Reported" });
  });

  return router;
};
