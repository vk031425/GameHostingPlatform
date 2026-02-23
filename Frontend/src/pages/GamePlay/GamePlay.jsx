import { data, useParams } from "react-router-dom";
import { useState, version } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./GamePlay.css";
import { Link } from "react-router-dom";
import PurchaseGameCard from "../../components/PurchaseGameCard/PurchaseGameCard";
import PlayGameCard from "../../components/PlayGameCard/PlayGameCard";
import DownloadGameCard from "../../components/DownloadGameCard/DownloadGameCard";
import RatingCard from "../../components/RatingCard/RatingCard";
import API from "../../config/api";
import { CDN_BASE_URL } from "../../config/constants";

const GamePlay = () => {
  const { slug } = useParams();
  const { authData, setAuthData } = useContext(AuthContext);
  const [gamedata, setgameData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = gamedata?.thumbnailUrl
    ? `${CDN_BASE_URL}/${gamedata.thumbnailUrl}`
    : "/images/fallback-thumbnail.jpg";

  const gameUrl = gamedata?.webEntry
    ? `${CDN_BASE_URL}/${gamedata.webEntry}`
    : "/images/fallback-thumbnail.jpg";

  const getgameData = async () => {
    try {
      const response = await API.get(`/games/${slug}`);
      setgameData(response.data);
      console.log(response);
    } catch (err) {
      console.error("Error fetching game:", err);
    }
  };

  let purchased = false;
  if (authData?.isLoggedIn && gamedata) {
    purchased = authData.user.purchasedGames.includes(gamedata._id);
  }

  const getTopRightCard = () => {
    if (!gamedata) return null;

    if (gamedata.isPremium && !purchased) {
      return <PurchaseGameCard price={gamedata.price} gameId={gamedata._id} />;
    } else if (gamedata.distributionType === "browser") {
      return <PlayGameCard gameUrl={gameUrl} />;
    } else {
      return <DownloadGameCard build={gamedata.build} />;
    }
  };

  useEffect(() => {
    if (slug) {
      getgameData();
    }
  }, [slug]);

  if (!gamedata) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="gameplay-page-container">
        <h1 id="game-title">{gamedata.title}</h1>
        <section className="gameplay-top-section">
          <div className="gameplay-top-left">
            <div className="gameplay-playscreen">
              {gamedata.distributionType === "browser" ? (
                purchased || !gamedata.isPremium ? (
                  isPlaying ? (
                    <iframe
                      src={gameUrl}
                      title={gamedata.title}
                      frameBorder="0"
                      allowFullScreen
                    />
                  ) : (
                    <div className="thumbnail-container">
                      <img src={thumbnailUrl} alt={gamedata.title} />
                      <button
                        className="play-button"
                        onClick={() => setIsPlaying(true)}
                      >
                        ▶
                      </button>
                    </div>
                  )
                ) : (
                  <div className="play-overlay">
                    <h2>Purchase to Play</h2>
                  </div>
                )
              ) : (
                <div className="download-preview thumbnail-container">
                  <img src={thumbnailUrl} alt={gamedata.title} />
                  <div className="play-overlay">
                    <h2>Download to Play</h2>
                  </div>
                </div>
              )}
            </div>
            <h1>About this game</h1>
            <div className="gameplay-game-tags">
              {gamedata.categories.map((tag) => (
                <button key={tag} className="gameplay-tag-button">
                  {tag}
                </button>
              ))}
            </div>
            <p>{gamedata.description}</p>
          </div>
          <div className="gameplay-top-right">
            <div className="gameplay-gamedetails-card">
              <h1>Game Details</h1>
              <hr />
              <div className="gameplay-gamedetails">
                <div className="detail">
                  <p>Release Date</p>
                  <p>{gamedata.createdAt}</p>
                </div>
                <div className="detail">
                  <p>Developer</p>
                  <p>{gamedata.developer.fullName}</p>
                </div>
                <div className="detail">
                  <p>Version</p>
                  <p>{gamedata.build.version}</p>
                </div>
                <div className="detail">
                  <p>Subscription</p>
                  <p>{gamedata.isPremium}</p>
                </div>
              </div>
            </div>
            {getTopRightCard()}
            <RatingCard
              rating={gamedata.rating}
              totalRatings={gamedata.totalRatings}
            />
          </div>
        </section>

        <section className="comment-section">
          <h1>Comments</h1>
        </section>
      </div>
    </div>
  );
};

export default GamePlay;
