import "./DeveloperProfileEditGame.css";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../../../config/api";
import { CDN_BASE_URL } from "../../../utils/constants";
import { categoriesList } from "../../../utils/categoriesList";

const DeveloperProfileEditGame = ({ gameId }) => {
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [gameData, setGameData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    trailerUrl: "",
    categories: [],
    isPremium: false,
    price: 0,
    version: "",
    thumbnailUrl: "",
    screenshots: [],
  });

  const [newThumbnail, setNewThumbnail] = useState(null);
  const [newScreenshots, setNewScreenshots] = useState([]);
  const [newBuildFile, setNewBuildFile] = useState(null);
  const [newVersion, setNewVersion] = useState("");

  // ================= Fetch Game =================
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await API.get(`/developer/game/${gameId}`);
        console.log(res);
        setGameData(res.data);
      } catch (err) {
        console.error("Failed to fetch game:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // ================= YouTube Embed =================
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId = null;
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    const embedMatch = url.match(/embed\/([^?]+)/);

    if (watchMatch) videoId = watchMatch[1];
    if (shortMatch) videoId = shortMatch[1];
    if (embedMatch) videoId = embedMatch[1];

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const toggleCategory = (category) => {
    let updatedCategories;

    if (gameData.categories.includes(category)) {
      updatedCategories = gameData.categories.filter((c) => c !== category);
    } else {
      if (gameData.categories.length >= 5) return;
      updatedCategories = [...gameData.categories, category];
    }

    setGameData({
      ...gameData,
      categories: updatedCategories,
    });
  };

  // ================= Metadata + Media Update =================
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // 1️⃣ Update metadata
      await API.put(`/developer/game/${gameId}`, {
        title: gameData.title,
        shortDescription: gameData.shortDescription,
        description: gameData.description,
        trailerUrl: gameData.trailerUrl,
        categories: gameData.categories,
        isPremium: gameData.isPremium,
        price: gameData.price,
      });

      // 2️⃣ Replace Thumbnail
      if (newThumbnail) {
        const { data } = await API.post("/game-upload/get-media-upload-url", {
          gameId,
          fileType: newThumbnail.type,
          mediaType: "thumbnail",
        });

        await axios.put(data.uploadUrl, newThumbnail, {
          headers: { "Content-Type": newThumbnail.type },
        });

        await API.post("/game-upload/confirm-media-upload", {
          gameId,
          fileKey: data.fileKey,
          mediaType: "thumbnail",
        });
      }

      // 3️⃣ Upload New Screenshots
      if (newScreenshots.length > 0) {
        for (const screenshot of newScreenshots) {
          const { data } = await API.post("/game-upload/get-media-upload-url", {
            gameId,
            fileType: screenshot.type,
            mediaType: "screenshot",
          });

          await axios.put(data.uploadUrl, screenshot, {
            headers: { "Content-Type": screenshot.type },
          });

          await API.post("/game-upload/confirm-media-upload", {
            gameId,
            fileKey: data.fileKey,
            mediaType: "screenshot",
          });
        }
      }

      alert("Game updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // ================= Delete Screenshot =================
  const deleteScreenshot = async (screenshotKey) => {
    try {
      await API.delete(`/developer/game/${gameId}/screenshot`, {
        data: { screenshotKey },
      });

      setGameData((prev) => ({
        ...prev,
        screenshots: prev.screenshots.filter((ss) => ss !== screenshotKey),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete screenshot");
    }
  };

  // ================= Build Update =================
  const handleBuildUpdate = async () => {
    if (!newBuildFile || !newVersion) {
      alert("Provide new version & build file.");
      return;
    }

    try {
      setIsUpdating(true);

      const uploadRes = await API.post("/game-upload/get-upload-url", {
        gameId,
        version: newVersion,
        fileType: newBuildFile.type,
      });

      const { uploadUrl, fileKey } = uploadRes.data;

      await axios.put(uploadUrl, newBuildFile, {
        headers: { "Content-Type": newBuildFile.type },
      });

      await API.post("/game-upload/confirm-upload", {
        gameId,
        fileKey,
        version: newVersion,
      });

      alert("Build updated. Sent for review.");
    } catch (err) {
      console.error(err);
      alert("Build update failed.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="edit-game-container">Loading...</div>;

  return (
    <div className="edit-game-container">
      <h1>Edit Game</h1>

      {/* ================= BASIC INFO ================= */}
      <div className="edit-section">
        <h2>Basic Information</h2>

        <div className="edit-review-card">
          <div className="edit-input-group">
            <label>Game Title</label>
            <input
              type="text"
              maxLength={50}
              value={gameData.title}
              onChange={(e) =>
                setGameData({ ...gameData, title: e.target.value })
              }
            />
          </div>

          <div className="edit-input-group">
            <label>Short Description</label>
            <textarea
              rows="3"
              maxLength={200}
              value={gameData.shortDescription}
              onChange={(e) =>
                setGameData({ ...gameData, shortDescription: e.target.value })
              }
            />
          </div>

          <div className="edit-input-group">
            <label>Description</label>
            <textarea
              rows="5"
              maxLength={10000}
              value={gameData.description}
              onChange={(e) =>
                setGameData({ ...gameData, description: e.target.value })
              }
            />
          </div>

          {/* Categories */}
          <div className="edit-input-group">
            <label>Categories (Select up to 5)</label>

            <div className="edit-category-tags">
              {categoriesList.map((category) => (
                <span
                  key={category}
                  className={`edit-category-tag ${
                    gameData.categories.includes(category) ? "active" : ""
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MEDIA ================= */}
      <div className="edit-section">
        <h2>Media</h2>

        <div className="edit-review-card">
          {/* Thumbnail Row */}
          <div className="edit-media-row">
            <div className="edit-media-label">
              <strong>Thumbnail</strong>
            </div>

            <div className="edit-media-value">
              {newThumbnail ? (
                <img
                  src={URL.createObjectURL(newThumbnail)}
                  className="edit-thumbnail-preview"
                />
              ) : gameData.thumbnailUrl ? (
                <img
                  src={`${CDN_BASE_URL}/${gameData.thumbnailUrl}`}
                  className="edit-thumbnail-preview"
                />
              ) : (
                <span>No thumbnail uploaded</span>
              )}

              <input
                type="file"
                onChange={(e) => setNewThumbnail(e.target.files[0])}
              />
            </div>
          </div>

          {/* Screenshots Row */}
          <div className="edit-media-row">
            <div className="edit-media-label">
              <strong>Screenshots</strong>
            </div>

            <div className="edit-media-value">
              {/* Existing Screenshots (from DB) */}
              <div className="edit-screenshot-grid">
                {gameData.screenshots?.map((ss, i) => (
                  <div
                    key={`existing-${i}`}
                    className="edit-screenshot-wrapper"
                  >
                    <img
                      src={
                        ss?.startsWith("http") ? ss : `${CDN_BASE_URL}/${ss}`
                      }
                      alt="screenshot"
                    />
                    <button
                      className="delete-screenshot-btn"
                      onClick={() => deleteScreenshot(ss)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Newly Selected Screenshots (NOT yet uploaded) */}
                {newScreenshots.map((file, i) => (
                  <div key={`new-${i}`} className="edit-screenshot-wrapper">
                    <img src={URL.createObjectURL(file)} alt="new-screenshot" />
                    <button
                      className="delete-screenshot-btn"
                      onClick={() =>
                        setNewScreenshots((prev) =>
                          prev.filter((_, index) => index !== i),
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <input
                type="file"
                multiple
                onChange={(e) =>
                  setNewScreenshots((prev) => [
                    ...prev,
                    ...Array.from(e.target.files),
                  ])
                }
              />
            </div>
          </div>

          {/* Trailer Row */}
          <div className="edit-media-row">
            <div className="edit-media-label">
              <strong>Trailer</strong>
            </div>

            <div className="edit-media-value">
              {getYoutubeEmbedUrl(gameData.trailerUrl) ? (
                <iframe
                  src={getYoutubeEmbedUrl(gameData.trailerUrl)}
                  title="trailer"
                  allowFullScreen
                />
              ) : (
                <span>No trailer added</span>
              )}

              <input
                type="text"
                value={gameData.trailerUrl}
                placeholder="YouTube URL"
                onChange={(e) =>
                  setGameData({ ...gameData, trailerUrl: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRICING ================= */}
      <div className="edit-section">
        <h2>Pricing</h2>

        <div className="edit-review-card">
          <label>
            <input
              type="checkbox"
              checked={gameData.isPremium}
              onChange={(e) =>
                setGameData({ ...gameData, isPremium: e.target.checked })
              }
            />
            Premium Game
          </label>

          {gameData.isPremium && (
            <input
              type="number"
              value={gameData.price}
              onChange={(e) =>
                setGameData({ ...gameData, price: e.target.value })
              }
            />
          )}
        </div>
      </div>

      {/* ================= BUILD ================= */}
      <div className="edit-section">
        <h2>Build Management</h2>

        <div className="edit-review-card">
          <p>
            <strong>Current Version:</strong> {gameData.version}
          </p>

          <input
            type="text"
            placeholder="New Version"
            value={newVersion}
            onChange={(e) => setNewVersion(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setNewBuildFile(e.target.files[0])}
          />

          <button
            className="update-build-btn"
            onClick={handleBuildUpdate}
            disabled={isUpdating}
          >
            Upload New Version
          </button>
        </div>
      </div>

      {/* ================= SAVE BUTTON ================= */}
      <button
        className="update-game-btn"
        onClick={handleUpdate}
        disabled={isUpdating}
      >
        Save Changes
      </button>
    </div>
  );
};

export default DeveloperProfileEditGame;
