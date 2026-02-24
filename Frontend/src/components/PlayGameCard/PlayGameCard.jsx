import "./PlayGameCard.css";
import API from "../../config/api";

const PlayGameCard = ({ mediaMode, gameId, setAuthData, setMediaMode }) => {
  const handleFavorite = async () => {
    const res = await API.post(`/games/${gameId}/favorite`);

    setAuthData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        favoriteGames: res.data.favoriteGames,
      },
    }));
  };

  const handlePlay = async () => {
    if (mediaMode === "trailer") {
      await API.post(`/games/${gameId}/engagement`);
      setMediaMode("game");
    } else {
      setMediaMode("trailer");
    }
  };
  return (
    <div className="playgame-card-container">
      <button className="playnow-button" onClick={handlePlay}>
        {mediaMode === "trailer" ? "Play Now" : "Show Trailer"}
      </button>
      <button onClick={handleFavorite} className="add-favorites-button">
        Add to Favorites
      </button>
    </div>
  );
};

export default PlayGameCard;
