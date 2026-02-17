const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      maxlength: 200,
    },

    // Media
    thumbnailUrl: {
      type: String,
      required: true,
    },

    coverImageUrl: {
      type: String,
    },

    screenshots: [
      {
        type: String,
      },
    ],

    // Game Files (Cloudflare R2)
    gameUrl: {
      type: String,
      required: true,
    },

    buildVersion: {
      type: String,
      default: "1.0.0",
    },

    // Category & Tags
    category: {
      type: String,
      enum: ["Action", "Puzzle", "Racing", "Arcade", "Multiplayer", "Other"],
    },

    tags: [
      {
        type: String,
      },
    ],

    // Developer
    developer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Stats
    views: {
      type: Number,
      default: 0,
    },

    plays: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    // Monetization
    isPremium: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },

    // Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Game", GameSchema);
