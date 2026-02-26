import { CDN_BASE_URL } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";
import "./ProfileGameCard.css";

const ProfileGameCard = ({
  game,
  showRemove = false,
  onRemove = null,
}) => {
  const navigate = useNavigate();

  const thumbnailUrl = game.thumbnailUrl
    ? `${CDN_BASE_URL}/${game.thumbnailUrl}`
    : "/images/fallback-thumbnail.jpg";

  const handleNavigate = () => {
    navigate(`/games/${game.slug}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(game._id);
    }
  };

  return (
    <div className="profile-game-card" onClick={handleNavigate}>
      {game.isPremium && (
        <div className="profile-game-card-badge">Premium</div>
      )}

      {showRemove && (
        <div className="profile-remove-btn" onClick={handleRemove}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      )}

      <img
        src={thumbnailUrl}
        alt={game.title}
        className="profile-game-card-image"
        onError={(e) => {
          e.target.src = "/images/fallback-thumbnail.jpg";
        }}
      />

      <div className="profile-game-card-content">
        <h2 className="profile-game-card-title">{game.title}</h2>

        <div className="profile-game-card-meta">
          <span>👁 {game.views}</span>
          <div className="profile-game-card-meta-right">
            <i className="fa-solid fa-star yellow-star"></i>
            <span>{game.rating ? game.rating.toFixed(1) : "0.0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGameCard;