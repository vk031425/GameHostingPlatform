import "./DownloadGameCard.css";
import API from "../../config/api";

const DownloadGameCard = ({ webEntry, authData, setAuthData, gameId }) => {
  const handleFavorite = async () => {
    if (!authData?.isLoggedIn) {
      alert("Please login to proceed.");
      return;
    }
    const res = await API.post(`/games/${gameId}/favorite`);

    setAuthData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        favoriteGames: res.data.favoriteGames,
      },
    }));
  };
  return (
    <div className="playgame-card-container">
      <button className="playnow-button">Download Now</button>
      <button onClick={handleFavorite} className="add-favorites-button">
        Add to Favorites
      </button>
    </div>
  );
};

export default DownloadGameCard;
