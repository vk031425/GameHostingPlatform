import "./PurchaseGameCard.css";
import API from "../../config/api";
import { useState } from "react";

const PurchaseGameCard = ({ price, setAuthData, gameId }) => {
  const [loading, setLoading] = useState(false);

  const handleWishlist = async () => {
    const res = await API.post(`/games/${gameId}/wishlist`);

    setAuthData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        wishlist: res.data.wishlist,
      },
    }));
  };

  const handleBuyNow = async () => {
    console.log("buy now clicked");
    try {
      setLoading(true);

      // 1️⃣ Create order from backend
      const { data } = await API.post("/payment/create-order", {
        gameId,
      });

      const order = data.order;

      // 2️⃣ Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Platform Name",
        description: "Game Purchase",
        order_id: order.id,

        handler: async function (response) {
          // 3️⃣ Verify payment on backend
          await API.post("/payment/verify", response);

          alert("Payment Successful 🎉");

          window.location.reload(); // refresh to show Play button
        },

        prefill: {
          name: "",
          email: "",
        },

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        alert("Payment Failed ❌");
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchasegame-card-container">
      <h1>₹ {price}</h1>

      <button
        className="buynow-button"
        onClick={handleBuyNow}
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>

      <button onClick={handleWishlist} className="add-wishlist-button">
        Add to Wishlist
      </button>
    </div>
  );
};

export default PurchaseGameCard;
