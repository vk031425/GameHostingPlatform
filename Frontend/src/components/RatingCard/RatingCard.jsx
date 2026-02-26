import "./RatingCard.css";
import { useEffect, useState } from "react";
import API from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const RatingRow = ({ stars, count, maxCount }) => {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

  return (
    <div className="rating-row">
      <div className="stars-container">
        {[...Array(5)].map((_, i) =>
          i < stars ? (
            <i key={i} className="fa-solid fa-star yellow-star"></i>
          ) : (
            <i key={i} className="fa-solid fa-star normal-star"></i>
          ),
        )}
      </div>

      <div className="bar-container">
        <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>

      <div className="rating-count">{count}</div>
    </div>
  );
};

const RatingCard = ({
  rating,
  totalRatings,
  gameId,
  setgameData,
  userRating,
}) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authData } = useContext(AuthContext);

  // Find max count for progress bar scaling
  const maxCount = Math.max(...totalRatings, 0);

  const handleRate = async (star) => {
    if (!authData?.isLoggedIn) {
      alert("Please login to rate this game.");
      return;
    }
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSelectedStar(star);

      const res = await API.post(`/games/${gameId}/rate`, {
        rating: star,
      });

      setgameData((prev) => ({
        ...prev,
        rating: res.data.rating,
        totalRatings: res.data.totalRatings,
      }));
    } catch (err) {
      console.error("Rating error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setSelectedStar(userRating || 0);
  }, [userRating]);

  return (
    <div className="rating-card">
      {/* TOP */}
      <div className="rating-card-top">
        <h1>Rating</h1>
        <p>Rating: {rating ? rating.toFixed(1) : "0.0"}</p>
      </div>

      <hr />

      {/* MIDDLE - DISTRIBUTION */}
      <div className="rating-card-middle">
        {[5, 4, 3, 2, 1].map((starValue) => {
          const count = totalRatings[starValue - 1]; // 0 index = 1 star

          return (
            <RatingRow
              key={starValue}
              stars={starValue}
              count={count}
              maxCount={maxCount}
            />
          );
        })}
      </div>

      <hr />

      {/* BOTTOM - USER RATING */}
      <div className="rating-card-bottom">
        <h2>Rate this game :</h2>

        <div className="rating-card-bottom-stars">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;

            return (
              <i
                key={i}
                className={`fa-solid fa-star ${
                  starValue <= (hoveredStar || selectedStar)
                    ? "yellow-star"
                    : "normal-star"
                }`}
                onMouseEnter={() => setHoveredStar(starValue)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => handleRate(starValue)}
                style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
              ></i>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
