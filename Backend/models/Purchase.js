const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },

  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  orderId: String,
  paymentId: String,

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: "INR",
  },

  platformFee: Number,
  developerEarning: Number,

  paymentProvider: {
    type: String,
    default: "razorpay",
  },

  status: {
    type: String,
    enum: ["created", "success", "failed", "refunded"],
    default: "created",
  },

  refundedAt: Date,
}, { timestamps: true });

PurchaseSchema.index({ userId: 1, gameId: 1 }, { unique: true });

module.exports = mongoose.model("Purchase", PurchaseSchema);