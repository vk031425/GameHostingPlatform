import "./ProfileFavorites.css";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import API from "../../../config/api";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";

const ProfileFavorites = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/user/favorites");
      setGames(res.data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (gameId) => {
    try {
      await API.put(`/user/favorites/remove/${gameId}`);

      setGames((prev) => prev.filter((g) => g._id !== gameId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div className="profile-favorites-container">
      <h1>Favorites</h1>

      <div className="profile-favorites-card-container">
        {games.length === 0 && <p>No favorite games yet.</p>}

        {games.map((game) => (
          <ProfileGameCard
            key={game._id}
            game={game}
            showRemove={true}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileFavorites;
