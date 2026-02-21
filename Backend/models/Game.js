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
      required: true,
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
      // required: true,
    },

    screenshots: [
      {
        type: String,
      },
    ],

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

      version: {
        type: String,
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
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

    plays: { type: Number, default: 0 },

    likes: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },

    totalRatings: [{ type: Number, default: 0 }],

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
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Game", GameSchema);
