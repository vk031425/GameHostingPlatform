import "./RatingCard.css";
import { useState } from "react";

const RatingRow = ({ stars, count, maxCount }) => {
  const percentage = (count / maxCount) * 100;

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

const RatingCard = (props) => {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  let maxCount = 0;
  props.ratings.forEach((rating) => {
    maxCount = Math.max(maxCount, rating);
  });

  return (
    <div className="rating-card">
      <div className="rating-card-top">
        <h1>Rating</h1>
        <p>Rating: 5</p>
      </div>
      <hr />
      <div className="rating-card-middle">
        {props.ratings.map((rating, index) => (
          <RatingRow
            key={index}
            stars={5 - index}
            count={rating}
            maxCount={maxCount}
          />
        ))}
      </div>
      <hr />
      <div className="rating-card-bottom">
        <h2>Rate this game :</h2>
        <div className="rating-card-bottom-stars">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;

            return (
              <i
                key={i}
                className={`fa-star fa-solid ${
                  starValue <= (hoveredStar || selectedStar)
                    ? "yellow-star"
                    : "normal-star"
                }`}
                onMouseEnter={() => setHoveredStar(starValue)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedStar(starValue)}
                style={{ cursor: "pointer" }}
              ></i>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
