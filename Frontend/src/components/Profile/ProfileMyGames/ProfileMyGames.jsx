import "./ProfileMyGames.css";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import API from "../../../config/api";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";

const ProfileMyGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchpurchasedGames = async () => {
    try {
      const res = await API.get("/user/purchasedgames");
      setGames(res.data.games);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchpurchasedGames();
  }, []);


  if (loading) return <p>Loading games...</p>;

  return (
    <div className="profile-mygames-container">
      <h1>Purchased Games</h1>

      <div className="profile-mygames-card-container">
        {games.length === 0 && <p>No games purchased yet.</p>}

        {games.map((game) => (
          <ProfileGameCard
            key={game._id}
            game={game}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileMyGames;
