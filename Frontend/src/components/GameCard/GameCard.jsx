import { CDN_BASE_URL } from "../../config/constants";
import { Link } from "react-router-dom";
import "./GameCard.css";

const GameCard = ({ gameId, slug, source, title, rating, views, isPremium }) => {
  const thumbnailUrl = source
    ? `${CDN_BASE_URL}/${source}`
    : "/images/fallback-thumbnail.jpg";

  return (
    <Link to={`/games/${slug}`} className="game-card-link">
      <div className="game-card">
        {isPremium && <div className="game-card-badge">Premium</div>}

        <img
          src={thumbnailUrl}
          alt={title}
          className="game-card-image"
          onError={(e) => {
            e.target.src = "/images/fallback-thumbnail.jpg";
          }}
        />

        <div className="game-card-content">
          <h2 className="game-card-title">{title}</h2>

          <div className="game-card-meta">
            <span>👁 {views}</span>
            <div className="game-card-meta-right">
              <i className="fa-solid fa-star yellow-star"></i>
              <span>{rating ? rating.toFixed(1) : "0.0"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
