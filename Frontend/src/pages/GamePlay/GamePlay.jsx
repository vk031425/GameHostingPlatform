import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./GamePlay.css";
import { Link } from "react-router-dom";
import PurchaseGameCard from "../../components/PurchaseGameCard/PurchaseGameCard";
import PlayGameCard from "../../components/PlayGameCard/PlayGameCard";
import DownloadGameCard from "../../components/DownloadGameCard/DownloadGameCard";
import RatingCard from "../../components/RatingCard/RatingCard";
import CommentCard from "../../components/CommentCard/CommentCard";
import API from "../../config/api";
import { CDN_BASE_URL } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";

const GamePlay = () => {
  const { slug } = useParams();
  const { authData, setAuthData } = useContext(AuthContext);
  const [gamedata, setgameData] = useState(null);
  const [mediaMode, setMediaMode] = useState("trailer");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed${parsed.pathname}`;
      }

      if (parsed.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
      }

      return null;
    } catch {
      return null;
    }
  };

  const trailerEmbedUrl = getYoutubeEmbedUrl(gamedata?.trailerUrl);
  const videoId = trailerEmbedUrl ? trailerEmbedUrl.split("/embed/")[1] : null;

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
      return (
        <PurchaseGameCard
          price={gamedata.price}
          setAuthData={setAuthData}
          gameId={gamedata._id}
        />
      );
    } else if (gamedata.distributionType === "browser") {
      return (
        <PlayGameCard
          mediaMode={mediaMode}
          setMediaMode={setMediaMode}
          gameId={gamedata._id}
          setAuthData={setAuthData}
        />
      );
    } else {
      return (
        <DownloadGameCard
          gameId={gamedata._id}
          setAuthData={setAuthData}
          build={gamedata.build}
        />
      );
    }
  };

  const fetchComments = async () => {
    const res = await API.get(`/comments/${gamedata._id}`);
    setComments(res.data);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await API.post(`/comments/${gamedata._id}`, {
        content: newComment,
      });

      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment");
    }
  };

  useEffect(() => {
    if (!gamedata) return;

    if (trailerEmbedUrl) {
      setMediaMode("trailer");
    } else if (gamedata.distributionType === "browser") {
      setMediaMode("game");
    }
  }, [gamedata, trailerEmbedUrl]);

  useEffect(() => {
    if (slug) {
      getgameData();
    }
  }, [slug]);

  useEffect(() => {
    if (gamedata?._id) {
      API.post(`/games/${gamedata._id}/view`);
      fetchComments();
    }
  }, [gamedata?._id]);

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
              {/* TRAILER */}
              {mediaMode === "trailer" && trailerEmbedUrl && (
                <iframe
                  key="trailer"
                  src={`${trailerEmbedUrl}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&showinfo=0&loop=1&playlist=${videoId}`}
                  title="Game Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}

              {/* GAME */}
              {mediaMode === "game" &&
                gamedata.distributionType === "browser" &&
                (!gamedata.isPremium || purchased) && (
                  <iframe
                    key="game"
                    src={gameUrl}
                    title={gamedata.title}
                    frameBorder="0"
                    allowFullScreen
                  />
                )}

              {/* FALLBACK THUMBNAIL */}
              {!trailerEmbedUrl && mediaMode === "trailer" && (
                <div className="thumbnail-container">
                  <img src={thumbnailUrl} alt={gamedata.title} />
                </div>
              )}
            </div>
            {/* Screenshots Section */}
            {gamedata.screenshots && gamedata.screenshots.length > 0 && (
              <div className="gameplay-screenshots">
                {gamedata.screenshots.map((shot, index) => (
                  <div className="screenshot-card" key={index}>
                    <img
                      src={`${CDN_BASE_URL}/${shot}`}
                      alt={`Screenshot ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
            <h1>About this game</h1>
            <div className="gameplay-game-tags">
              {gamedata.categories.map((tag) => (
                <button key={tag} className="gameplay-tag-button">
                  {tag}
                </button>
              ))}
            </div>
            <p>{gamedata.shortDescription}</p>
            <p>{gamedata.description}</p>
          </div>
          <div className="gameplay-top-right">
            <div className="gameplay-gamedetails-card">
              <h1>Game Details</h1>
              <hr />
              <div className="gameplay-gamedetails">
                <div className="detail">
                  <p>Release Date</p>
                  <p>{formatDate(gamedata.createdAt)}</p>
                </div>
                <div className="detail">
                  <p>Developer</p>
                  <p>{gamedata.developer.fullName}</p>
                </div>
                <div className="detail">
                  <p>Version</p>
                  <p>{gamedata.version}</p>
                </div>
                <div className="detail">
                  <p>Subscription</p>
                  {gamedata.isPremium ? <p>Premium</p> : <p>Free</p>}
                </div>
              </div>
            </div>
            {getTopRightCard()}
            <RatingCard
              rating={gamedata.rating}
              totalRatings={gamedata.totalRatings}
              gameId={gamedata._id}
              setgameData={setgameData}
              userRating={gamedata.userRating}
            />
          </div>
        </section>

        <section className="comment-section">
          <h1>Comments ({comments.length})</h1>

          {authData?.isLoggedIn ? (
            <div className="comment-input-box">
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
          ) : (
            <p>Please login to comment.</p>
          )}

          <div className="comment-list">
            {comments
              .filter((c) => !c.parent)
              .map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  allComments={comments}
                  refresh={fetchComments}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GamePlay;
