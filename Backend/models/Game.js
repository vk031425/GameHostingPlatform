const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema(
  {
    // Basic Information
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
      default: "",
      maxlength: 5000,
    },

    shortDescription: {
      type: String,
      maxlength: 200,
    },

    categories: [
      {
        type: String,
        trim: true,
      },
    ],

    // Media
    thumbnailUrl: {
      type: String,
    },

    screenshots: {
      type: [String],
      default: [],
    },

    trailerUrl: {
      type: String,
    },

    // Developer
    developer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Distribution
    distributionType: {
      type: String,
      enum: ["browser", "download"],
      required: true,
    },

    build: {
      fileKey: {
        type: String,
      },

      fileSize: {
        type: Number, // in bytes
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },

    version: {
      type: String,
      required: true,
    },

    webEntry: {
      type: String,
    },

    // Only for downloadable games
    supportedOS: [
      {
        type: String,
        enum: ["Windows", "Mac", "Linux"],
      },
    ],

    systemRequirements: {
      type: String,
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

    // Statistics
    views: { type: Number, default: 0 },

    rating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: [Number],
      default: [0, 0, 0, 0, 0],
    },

    userRatings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],

    plays: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },

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

    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Game", GameSchema);
