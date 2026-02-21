import { useRef } from "react";
import "./UploadMedia.css";

const UploadMedia = ({ data, setData, nextStep, prevStep }) => {
  const thumbnailRef = useRef(null);
  const screenshotsRef = useRef(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "screenshots") {
      setData({
        ...data,
        screenshots: [...data.screenshots, ...Array.from(files)].slice(0, 8),
      });
    } else {
      setData({
        ...data,
        thumbnail: files[0],
      });
    }
  };

  const removeScreenshot = (index) => {
    const updated = data.screenshots.filter((_, i) => i !== index);
    setData({ ...data, screenshots: updated });
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    let videoId = null;

    // Case 1: youtube.com/watch?v=...
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      videoId = watchMatch[1];
    }

    // Case 2: youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) {
      videoId = shortMatch[1];
    }

    // Case 3: youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/embed\/([^?]+)/);
    if (embedMatch) {
      videoId = embedMatch[1];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.thumbnail) {
      alert("Thumbnail required");
      return;
    }
    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="developer-profile-media-upload-form"
    >
      <div className="uploadgame-media-form-header">
        <h1>Game Media</h1>
        <p> Upload images and visuals to showcase your game</p>
      </div>

      {/* thumbnail */}
      <div className="uploadgame-media-thumbnailcard">
        <div className="uploadgame-media-thumbnailcard-top">
          <h3>Thumbnail</h3>
          <p>Drag & drop or click to upload thumbnail</p>
        </div>
        <div
          className="uploadgame-media-thumbnail-dropzone"
          onClick={() => thumbnailRef.current.click()}
        >
          {data.thumbnail ? (
            <img src={URL.createObjectURL(data.thumbnail)} alt="thumbnail" />
          ) : (
            <div className="uploadgame-media-thumbnail-dropzone-placeholder">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <p>Drag & drop or click to upload thumbnail</p>
              <span>Recommended Aspect Ratio: 16:9 (LandScape)</span>
              <span>Max 5MB · JPG, PNG, WEBP</span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={thumbnailRef}
          name="thumbnail"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* screenshot */}
      <div className="uploadgame-media-screenshotscard">
        <div className="uploadgame-media-screenshotscard-top">
          <h3>
            Screenshots <span>(Optional)</span>
          </h3>
          <p>Add up to 8 gameplay images</p>
        </div>
        <div className="uploadgame-media-screenshots-grid">
          {data.screenshots.map((file, index) => (
            <div key={index} className="uploadgame-media-screenshot-item">
              <img src={URL.createObjectURL(file)} alt="ss" />
              <button
                type="button"
                className="uploadgame-media-screenshot-remove-btn"
                onClick={() => removeScreenshot(index)}
              >
                ✕
              </button>
            </div>
          ))}

          {data.screenshots.length < 8 && (
            <div
              className="uploadgame-media-screenshot-add"
              onClick={() => screenshotsRef.current.click()}
            >
              +<span>Add Screenshot</span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={screenshotsRef}
          name="screenshots"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* Trailer */}
      <div className="uploadgame-media-videocard">
        <div className="uploadgame-media-videocard-top">
          <h3>
            Trailer URL <span>(Optional)</span>{" "}
          </h3>
          <p>Show off your game with a trailer video</p>
        </div>

        <div className="uploadgame-media-videocard-input">
          <i className="fa-brands fa-youtube"></i>
          <input
            type="url"
            placeholder="Paste a YouTube or Vimeo link..."
            value={data.trailerUrl || ""}
            onChange={(e) => setData({ ...data, trailerUrl: e.target.value })}
          />
        </div>

        {getYoutubeEmbedUrl(data.trailerUrl) && (
          <div className="uploadgame-media-video-preview">
            <iframe
              src={getYoutubeEmbedUrl(data.trailerUrl)}
              title="trailer"
              allowFullScreen
            />
          </div>
        )}
      </div>

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

          <button type="submit" className="uploadgame-btn next-btn">
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default UploadMedia;
