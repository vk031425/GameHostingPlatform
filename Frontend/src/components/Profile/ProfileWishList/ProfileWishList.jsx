import "./ProfileWishList.css";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import API from "../../../config/api";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";

const ProfileWishList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/user/wishlist");
      setGames(res.data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (gameId) => {
    try {
      await API.put(`/user/wishlist/remove/${gameId}`);

      setGames((prev) => prev.filter((g) => g._id !== gameId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading wishlist...</p>;

  return (
    <div className="profile-wishlist-container">
      <h1>WishList</h1>

      <div className="profile-wishlist-card-container">
        {games.length === 0 && <p>No games added yet.</p>}

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

export default ProfileWishList;
