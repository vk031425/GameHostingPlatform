import { useState } from "react";
import "./UploadPublish.css";

const UploadPublish = ({
  data,
  prevStep,
  goToStep,
  onPublish,
  isPublishing,
  uploadProgress,
}) => {
  const [agreeRights, setAgreeRights] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const price = Number(data.price || 0);
  const commission = Math.floor(price * (data.commission || 0));
  const earning = price - commission;

  const canPublish = agreeRights && agreeTerms;

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

  const handlePublish = () => {
    if (!canPublish) return;
    onPublish();
  };

  return (
    <div className="uploadgame-publish-container">
      <div className="uploadgame-publish-container-header">
        <h1>Review & Publish</h1>
        <p>Review your game details before going live.</p>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="uploadgame-publish-review-section">
        <div className="uploadgame-publish-review-header">
          <h3>Basic Info</h3>
          <button onClick={() => goToStep(1)}>Edit</button>
        </div>

        <div className="uploadgame-publish-review-card">
          <p>
            <strong>Title:</strong> {data.gameTitle}
          </p>
          <p>
            <strong>Categories:</strong> {data.categories?.join(", ")}
          </p>
          <p>
            <strong>Short Description:</strong> {data.shortDescription}
          </p>
          <p>
            <strong>Description:</strong> {data.description}
          </p>
        </div>
      </div>

      {/* ================= MEDIA ================= */}
      <div className="uploadgame-publish-review-section">
        <div className="uploadgame-publish-review-header">
          <h3>Media</h3>
          <button onClick={() => goToStep(2)}>Edit</button>
        </div>

        <div className="uploadgame-publish-review-card uploadgame-publish-media-review-card">
          {/* Thumbnail Row */}
          <div className="uploadgame-publish-media-review-row">
            <div className="uploadgame-publish-media-review-label">
              <strong>Thumbnail</strong>
            </div>

            <div className="uploadgame-publish-media-review-value">
              {data.thumbnail ? (
                <img
                  src={URL.createObjectURL(data.thumbnail)}
                  alt="thumbnail"
                  className="uploadgame-publish-media-thumb"
                />
              ) : (
                <span className="uploadgame-publish-media-empty-text">
                  No thumbnail uploaded
                </span>
              )}
            </div>
          </div>

          {/* Screenshots Row */}
          <div className="uploadgame-publish-media-review-row">
            <div className="uploadgame-publish-media-review-label">
              <strong>Screenshots</strong>
            </div>

            <div className="uploadgame-publish-media-review-value">
              {data.screenshots?.length > 0 ? (
                <div className="uploadgame-publish-media-screenshot-grid">
                  {data.screenshots.map((file, index) => (
                    <img key={index} src={URL.createObjectURL(file)} alt="ss" />
                  ))}
                </div>
              ) : (
                <span className="uploadgame-publish-media-empty-text">
                  No screenshots added
                </span>
              )}
            </div>
          </div>

          {/* Trailer Row */}
          <div className="uploadgame-publish-media-review-row">
            <div className="uploadgame-publish-media-review-label">
              <strong>Trailer</strong>
            </div>

            <div className="uploadgame-publish-media-review-value">
              {getYoutubeEmbedUrl(data.trailerUrl) ? (
                <iframe
                  src={getYoutubeEmbedUrl(data.trailerUrl)}
                  title="trailer"
                  allowFullScreen
                />
              ) : (
                <span className="uploadgame-publish-media-empty-text">
                  No trailer added
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= DISTRIBUTION ================= */}
      <div className="uploadgame-publish-review-section">
        <div className="uploadgame-publish-review-header">
          <h3>Distribution</h3>
          <button onClick={() => goToStep(3)}>Edit</button>
        </div>

        <div className="uploadgame-publish-review-card">
          <p>
            <strong>Type:</strong>{" "}
            {data.distributionType === "browser"
              ? "Browser Playable"
              : "Downloadable"}
          </p>

          {data.buildFile && (
            <p>
              <strong>File Size:</strong>{" "}
              {(data.buildFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}

          {data.supportedOS?.length > 0 && (
            <p>
              <strong>Supported OS:</strong> {data.supportedOS.join(", ")}
            </p>
          )}

          {data.systemRequirements && (
            <p>
              <strong>System Requirements:</strong> {data.systemRequirements}
            </p>
          )}
        </div>
      </div>

      {/* ================= PRICING ================= */}
      <div className="uploadgame-publish-review-section">
        <div className="uploadgame-publish-review-header">
          <h3>Pricing</h3>
          <button onClick={() => goToStep(4)}>Edit</button>
        </div>

        <div className="uploadgame-publish-review-card">
          <p>
            <strong>Type:</strong> {data.isPaid ? "Paid" : "Free"}
          </p>

          {data.isPaid && (
            <>
              <p>
                <strong>Price:</strong> ₹{price}
              </p>
              <p>
                <strong>Platform Fee (10%):</strong> ₹{commission}
              </p>
              <p className="highlight">
                <strong>You Earn:</strong> ₹{earning}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ================= CONFIRMATION ================= */}
      <div className="uploadgame-publish-confirmation-area">
        <label className="uploadgame-publish-confirmationlabel">
          <input
            type="checkbox"
            checked={agreeRights}
            onChange={() => setAgreeRights(!agreeRights)}
          />
          I confirm I own the rights to this game
        </label>

        <label className="uploadgame-publish-confirmationlabel">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
          />
          I agree to platform terms
        </label>
      </div>

      {/* ================= FOOTER ================= */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginBottom: "15px" }}>
          <p>Uploading: {uploadProgress}%</p>
          <div
            style={{
              height: "6px",
              width: `${uploadProgress}%`,
              background: "green",
              borderRadius: "4px",
            }}
          />
        </div>
      )}
      <hr className="uploadgame-form-hr" />

      <div className="uploadgame-form-footer">
        <button
          type="button"
          className="uploadgame-btn back-btn"
          onClick={prevStep}
        >
          Back
        </button>

        <div className="right-buttons">
          <button
            type="button"
            className="uploadgame-btn cancel-btn"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>

          <button
            className="publish-btn"
            disabled={!canPublish || isPublishing}
            onClick={handlePublish}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPublish;
