const express = require("express");
const Game = require("../models/Game");
const r2 = require("../config/r2");

const { v4: uuidv4 } = require("uuid");

const {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const verifyuser = require("../middlewares/auth");

module.exports = () => {
  const router = express.Router();

  /*
  ============================================
  1️⃣ CREATE GAME
  ============================================
  */

  router.post("/game-upload/create", verifyuser, async (req, res) => {
    try {
      const {
        title,
        description,
        shortDescription,
        categories,
        trailerUrl,
        distributionType,
        supportedOS,
        systemRequirements,
        isPremium,
        price,
      } = req.body;

      if (!title || !description || !distributionType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      let slug = baseSlug;
      let counter = 1;

      while (await Game.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const game = await Game.create({
        title,
        slug,
        description,
        shortDescription,
        categories,

        trailerUrl,

        developer: req.user.id,

        distributionType,
        supportedOS,
        systemRequirements,

        isPremium,
        price,

        status: "pending",
      });

      res.status(201).json({
        message: "Game created successfully",
        gameId: game._id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Game creation failed" });
    }
  });

  /*
  ============================================
  2️⃣ GENERATE UPLOAD URL
  ============================================
  */

  router.post("/game-upload/get-upload-url", verifyuser, async (req, res) => {
    try {
      const { gameId, version, fileType } = req.body;

      if (!gameId || !version) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const game = await Game.findById(gameId);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.developer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const uniqueId = uuidv4();

      const fileKey = `games/${req.user.id}/${gameId}/${version}-${uniqueId}.zip`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: fileKey,
        ContentType: fileType,
      });

      const uploadUrl = await getSignedUrl(r2, command, {
        expiresIn: 300,
      });

      res.json({ uploadUrl, fileKey });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate upload URL" });
    }
  });

  /*
  ============================================
  3️⃣ CONFIRM UPLOAD
  ============================================
  */

  router.post("/game-upload/confirm-upload", verifyuser, async (req, res) => {
    try {
      const { gameId, fileKey, version } = req.body;

      if (!gameId || !fileKey || !version) {
        return res.status(400).json({ message: "Missing fields" });
      }

      const game = await Game.findById(gameId);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.developer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const headCommand = new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: fileKey,
      });

      const fileInfo = await r2.send(headCommand);

      if (!fileInfo) {
        return res.status(400).json({ message: "Upload not found" });
      }

      if (game.build?.fileKey) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: game.build.fileKey,
        });

        await r2.send(deleteCommand);
      }

      game.build = {
        fileKey,
        fileSize: fileInfo.ContentLength,
        version,
        uploadedAt: new Date(),
      };

      await game.save();

      res.json({ message: "Build updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload confirmation failed" });
    }
  });

  router.post(
    "/game-upload/get-media-upload-url",
    verifyuser,
    async (req, res) => {
      try {
        const { gameId, fileType, mediaType } = req.body;

        if (!gameId || !fileType || !mediaType) {
          return res.status(400).json({ message: "Missing fields" });
        }

        const game = await Game.findById(gameId);

        if (!game) {
          return res.status(404).json({ message: "Game not found" });
        }

        if (game.developer.toString() !== req.user.id) {
          return res.status(403).json({ message: "Not authorized" });
        }

        const uniqueId = uuidv4();

        const extension = fileType.split("/")[1];

        const fileKey = `games/${req.user.id}/${gameId}/media/${mediaType}-${uniqueId}.${extension}`;

        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: fileKey,
          ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(r2, command, {
          expiresIn: 300,
        });

        res.json({ uploadUrl, fileKey });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Failed to generate media upload URL" });
      }
    },
  );

  router.post(
    "/game-upload/confirm-media-upload",
    verifyuser,
    async (req, res) => {
      try {
        const { gameId, fileKey, mediaType } = req.body;

        const game = await Game.findById(gameId);

        if (!game) return res.status(404).json({ message: "Game not found" });

        if (game.developer.toString() !== req.user.id) {
          return res.status(403).json({ message: "Not authorized" });
        }

        if (mediaType === "thumbnail") {
          game.thumbnailUrl = fileKey;
        }

        if (mediaType === "screenshot") {
          game.screenshots.push(fileKey);
        }

        await game.save();

        res.json({ message: "Media uploaded successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Media confirmation failed" });
      }
    },
  );

  router.post(
    "/game-upload/get-web-upload-url",
    verifyuser,
    async (req, res) => {
      try {
        const { gameId, filePath, fileType } = req.body;

        if (!gameId || !filePath) {
          return res.status(400).json({ message: "Missing fields" });
        }

        if (filePath.includes("..")) {
          return res.status(400).json({ message: "Invalid file path" });
        }

        const game = await Game.findById(gameId);

        if (!game) {
          return res.status(404).json({ message: "Game not found" });
        }

        if (game.developer.toString() !== req.user.id) {
          return res.status(403).json({ message: "Not authorized" });
        }

        const fileKey = `games/${req.user.id}/${gameId}/web/${filePath}`;

        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET,
          Key: fileKey,
          ContentType: fileType || "application/octet-stream",
        });

        const uploadUrl = await getSignedUrl(r2, command, {
          expiresIn: 300,
        });

        res.json({ uploadUrl, fileKey });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to generate web upload URL" });
      }
    },
  );

  router.post(
    "/game-upload/confirm-web-upload",
    verifyuser,
    async (req, res) => {
      try {
        const { gameId } = req.body;

        const game = await Game.findById(gameId);

        if (!game) {
          return res.status(404).json({ message: "Game not found" });
        }

        if (game.developer.toString() !== req.user.id) {
          return res.status(403).json({ message: "Not authorized" });
        }

        const indexKey = `games/${req.user.id}/${gameId}/web/index.html`;

        // Check if index.html exists
        try {
          await r2.send(
            new HeadObjectCommand({
              Bucket: process.env.R2_BUCKET,
              Key: indexKey,
            }),
          );
        } catch (err) {
          return res.status(400).json({
            message: "index.html not found in uploaded folder",
          });
        }

        game.webEntry = indexKey;

        await game.save();

        res.json({ message: "Web upload confirmed successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Web confirmation failed" });
      }
    },
  );

  /*
============================================
❌ DELETE GAME (CLEANUP FAILED UPLOAD)
============================================
*/

  router.delete("/game-upload/delete/:gameId", verifyuser, async (req, res) => {
    try {
      const { gameId } = req.params;

      const game = await Game.findById(gameId);

      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      if (game.developer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Delete build file if exists
      if (game.build?.fileKey) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: game.build.fileKey,
          }),
        );
      }

      // Delete thumbnail
      if (game.thumbnailUrl) {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: game.thumbnailUrl,
          }),
        );
      }

      // Delete screenshots
      if (game.screenshots?.length > 0) {
        for (const key of game.screenshots) {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET,
              Key: key,
            }),
          );
        }
      }

      // Delete web folder files
      const webPrefix = `games/${req.user.id}/${gameId}/web/`;

      // Optional: Use ListObjects + delete all under prefix
      // (recommended for web builds)

      await Game.findByIdAndDelete(gameId);

      res.json({ message: "Game deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete game" });
    }
  });

  return router;
};
