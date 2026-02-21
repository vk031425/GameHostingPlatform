import { useEffect, useState } from "react";
import "./UploadPricing.css";

const UploadPricing = ({ data, setData, nextStep, prevStep }) => {
  const [error, setError] = useState("");

  const isFree = data.isPaid === false;
  const isPaid = data.isPaid === true;

  const handlePriceChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    setData({ ...data, price: value });
  };

  const priceNumber = Number(data.price || 0);
  const platformFee = Math.floor(priceNumber * data.commission);
  const finalEarning = priceNumber - platformFee;

  const validate = () => {
    if (data.isPaid === null) {
      setError("Please select Free or Paid.");
      return false;
    }

    if (isPaid && (!data.price || priceNumber <= 0)) {
      setError("Enter a valid price greater than ₹0.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="developer-profile-pricing-upload-form"
    >
      <div className="uploadgame-pricing-form-header">
        <h1>Pricing</h1>
        <p>Choose whether your game is free or requires purchase.</p>
      </div>

      {/*Free vs Paid Cards */}
      <div className="uploadgame-pricing-cards">
        <div
          className={`uploadgame-pricing-card ${isFree ? "active" : ""}`}
          onClick={() => setData({ ...data, isPaid: false })}
        >
          <div className="uploadgame-pricing-card-check">{isFree && "✔"}</div>
          <h3>Free Game</h3>
          <p>Players can access your game without payment.</p>
          <span className="uploadgame-badge uploadgame-growth">Best for growth</span>
        </div>

        <div
          className={`uploadgame-pricing-card ${isPaid ? "active" : ""}`}
          onClick={() => setData({ ...data, isPaid: true })}
        >
          <div className="uploadgame-pricing-card-check">{isPaid && "✔"}</div>
          <h3>Paid Game</h3>
          <p>Players must purchase before accessing the game.</p>
          <span className="uploadgame-badge uploadgame-revenue">Earn revenue</span>
        </div>
      </div>

      {/* Free Info Box */}
      {isFree && (
        <div className="uploadgame-pricing-info-box">
          This game will be accessible to all players. No payment required.
        </div>
      )}

      {/*Paid Dynamic Section */}
      {isPaid && (
        <div className="uploadgame-paid-section">
          {/* Price Input */}
          <div className="uploadgame-price-input">
            <label>Game Price (₹)</label>
            <div className="uploadgame-price-field">
              <span>₹</span>
              <input
                type="text"
                value={data.price || ""}
                onChange={handlePriceChange}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="uploadgame-pricing-revenue-box">
            <div className="uploadgame-pricing-revenue-detail">
              <span>Game Price:</span>
              <span>₹{priceNumber || 0}</span>
            </div>
            <div className="uploadgame-pricing-revenue-detail">
              <span>Platform Fee (10%):</span>
              <span>₹{platformFee || 0}</span>
            </div>
            <div className="uploadgame-pricing-earn-highlight">
              <span>You Earn:</span>
              <span>₹{finalEarning > 0 ? finalEarning : 0}</span>
            </div>
          </div>

          {/* Access Notice */}
          <div className="uploadgame-pricing-access-notice">
            {data.distributionType === "browser"
              ? "Play button will unlock after purchase."
              : "Download button will unlock after purchase."}
          </div>
        </div>
      )}

      {error && <div className="uploadgame-pricing-error-text">{error}</div>}

       <hr className="uploadgame-form-hr" />

      <div className="uploadgame-form-footer">
        <button
          type="button"
          className="uploadgame-btn back-btn"
          onClick={prevStep}
        >
          Back
        </button>

        <div className="right-buttons">
          <button
            type="button"
            className="uploadgame-btn cancel-btn"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>

          <button type="submit" className="uploadgame-btn next-btn">
            Next
          </button>
        </div>
      </div>
    </form>
  );
};


export default UploadPricing;
