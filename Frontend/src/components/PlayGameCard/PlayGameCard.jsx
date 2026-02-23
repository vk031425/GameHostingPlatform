import "./PlayGameCard.css";
const PlayGameCard = ({ webEntry }) => {
  return (
    <div className="playgame-card-container">
      <button className="playnow-button">Play Now</button>
      <button className="add-favorites-button">Add to Favorites</button>
    </div>
  );
};

export default PlayGameCard;
