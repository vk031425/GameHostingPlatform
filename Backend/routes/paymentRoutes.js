const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Game = require("../models/Game");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const verifyuser = require("../middlewares/auth");

module.exports = () => {
  const router = express.Router();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  // =====================================
  // CREATE ORDER
  // =====================================
  router.post("/payment/create-order", verifyuser, async (req, res) => {
    try {
      const { gameId } = req.body;
      const userId = req.user.id;

      // 1️⃣ Validate game
      const game = await Game.findById(gameId);
      if (!game || !game.isPremium) {
        return res.status(400).json({ message: "Invalid game" });
      }

      // 2️⃣ Check if already purchased (success)
      const successPurchase = await Purchase.findOne({
        userId,
        gameId,
        status: "success",
      });

      if (successPurchase) {
        return res.status(400).json({ message: "Game already purchased" });
      }

      // 3️⃣ Check if a pending order already exists
      const pendingPurchase = await Purchase.findOne({
        userId,
        gameId,
        status: "created",
      });

      if (pendingPurchase) {
        return res.json({
          order: {
            id: pendingPurchase.orderId,
            amount: pendingPurchase.amount * 100,
            currency: pendingPurchase.currency || "INR",
          },
        });
      }

      // 4️⃣ Create Razorpay order
      const order = await razorpay.orders.create({
        amount: game.price * 100,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      });

      // 5️⃣ Revenue split (20% platform example)
      const platformFee = game.price * 0.2;
      const developerEarning = game.price - platformFee;

      // 6️⃣ Create purchase entry
      await Purchase.create({
        userId,
        gameId,
        developerId: game.developer,
        orderId: order.id,
        amount: game.price,
        currency: "INR",
        platformFee,
        developerEarning,
        status: "created",
      });

      res.json({ order });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Order creation failed" });
    }
  });

  // =====================================
  // VERIFY PAYMENT
  // =====================================
  router.post("/payment/verify", verifyuser, async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

      const userId = req.user.id;

      // 1️⃣ Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      // 2️⃣ Find purchase
      const purchase = await Purchase.findOne({
        orderId: razorpay_order_id,
      });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // 3️⃣ Prevent double verification
      if (purchase.status === "success") {
        return res.json({ success: true });
      }

      // 4️⃣ Update purchase to success
      purchase.paymentId = razorpay_payment_id;
      purchase.status = "success";
      await purchase.save();

      // 5️⃣ Add to user's purchasedGames
      await User.findByIdAndUpdate(userId, {
        $addToSet: { purchasedGames: purchase.gameId },
      });

      // 6️⃣ Increase game revenue
      await Game.findByIdAndUpdate(purchase.gameId, {
        $inc: { revenue: purchase.amount },
      });

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Verification failed" });
    }
  });

  return router;
};
