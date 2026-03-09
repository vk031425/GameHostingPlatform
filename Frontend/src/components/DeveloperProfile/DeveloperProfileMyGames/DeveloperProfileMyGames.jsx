import "./DeveloperProfileMyGames.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../config/api";
import { CDN_BASE_URL } from "../../../utils/constants";

const DeveloperProfileMyGames = ({ onEdit }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await API.get("/developer/mygames");
        setGames(res.data);
        console.log("Fetched developer games:", res.data);
      } catch (err) {
        console.error("Failed to fetch developer games:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game?",
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/developer/game/${id}`);
      setGames((prev) => prev.filter((game) => game._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return <div className="developer-mygames-container">Loading...</div>;
  }

  return (
    <div className="developer-mygames-container">
      <div className="developer-mygames-top">
        <h1>My Games</h1>
      </div>

      {games.length === 0 ? (
        <div className="developer-mygames-empty">
          <p>You haven't uploaded any games yet.</p>
          <Link to="/developer" className="developer-upload-btn">
            Upload Your First Game
          </Link>
        </div>
      ) : (
        <div className="developer-mygames-list">
          {games.map((game) => (
            <div key={game._id} className="developer-mygame-card">
              <img
                src={`${CDN_BASE_URL}/${game.thumbnailUrl}`}
                alt={game.title}
                className="developer-mygame-thumbnail"
              />

              <div className="developer-mygame-info">
                <h2>{game.title}</h2>
                <p>Version: {game.version}</p>

                <span className={`developer-status ${game.status}`}>
                  {game.status}
                </span>

                <div className="developer-mygame-stats">
                  <span>
                    <i className="fa-solid fa-eye"></i> {game.views}
                  </span>
                  <span>
                    <i className="fa-solid fa-play"></i> {game.plays}
                  </span>
                </div>

                <div className="developer-mygame-actions">
                  <Link to={`/game/${game.slug}`} className="developer-btn">
                    View
                  </Link>

                  <button
                    className="developer-btn"
                    onClick={() => onEdit(game._id)}
                  >
                    Edit
                  </button>

                  <button
                    className="developer-btn delete-btn"
                    onClick={() => handleDelete(game._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperProfileMyGames;
