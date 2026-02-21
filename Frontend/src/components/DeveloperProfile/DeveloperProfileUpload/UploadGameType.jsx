import { useRef } from "react";
import "./UploadGameType.css";

const UploadGameType = ({ data, setData, nextStep, prevStep }) => {
  const buildRef = useRef(null);

  const selectType = (type) => {
    setData({
      ...data,
      distributionType: type,
      buildFile: null,
    });
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setData({
      ...data,
      buildFile: file,
    });
  };

  const toggleOS = (os) => {
    const exists = data.supportedOS.includes(os);

    setData({
      ...data,
      supportedOS: exists
        ? data.supportedOS.filter((o) => o !== os)
        : [...data.supportedOS, os],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.distributionType) {
      alert("Select distribution type");
      return;
    }

    if (!data.buildFile) {
      alert("Upload game file");
      return;
    }

    nextStep();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="developer-profile-gametype-upload-form"
    >
      <div className="uploadgame-gametype-form-header">
        <h1>Game Distribution Type</h1>
        <p>Choose how players will access your game.</p>
      </div>

      {/*Toggle Cards */}
      <div className="uploadgame-gametype-distribution-cards">
        <div
          className={`uploadgame-gametype-distribution-card ${
            data.distributionType === "browser" ? "active" : ""
          }`}
          onClick={() => selectType("browser")}
        >
          <i class="fa-solid fa-globe"></i>
          <h3>Playable in Browser</h3>
          <p>Players can instantly play your game without downloading.</p>
        </div>

        <div
          className={`uploadgame-gametype-distribution-card ${
            data.distributionType === "download" ? "active" : ""
          }`}
          onClick={() => selectType("download")}
        >
          <i class="fa-solid fa-arrow-down"></i>
          <h3>Downloadable</h3>
          <p>Players must download the game file to play.</p>
        </div>
      </div>

      <div className="uploadgame-inputbox">
        <label>Game Version</label>
        <input
          type="text"
          name="version"
          placeholder="Enter your game version (e.g., 1.0.0)"
          value={data.version || ""}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </div>

      {/*Dynamic Upload Section */}
      {data.distributionType && (
        <>
          <div className="uploadgame-gametype-uploadcard">
            <div className="uploadgame-gametype-uploadcard-top">
              <h3>
                {data.distributionType === "browser"
                  ? "Upload WebGL Build (.zip)"
                  : "Upload Game File"}
              </h3>
            </div>
            <div
              className="uploadgame-gametype-upload-dropzone"
              onClick={() => buildRef.current.click()}
            >
              {data.buildFile ? (
                <div className="file-info">
                  <p>{data.buildFile.name}</p>
                  <span>
                    {(data.buildFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <div className="uploadgame-gametype-upload-drop-placeholder">
                  <p>
                    {data.distributionType === "browser"
                      ? "Drag & Drop WebGL .zip File"
                      : "Drag & Drop .zip / .exe File"}
                  </p>
                  <span>Max size: 500MB</span>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={buildRef}
              hidden
              accept={
                data.distributionType === "browser" ? ".zip" : ".zip,.exe"
              }
              onChange={handleFileChange}
            />
          </div>

          {/* Downloadable Only */}
          {data.distributionType === "download" && (
            <>
              <div className="uploadgame-gametype-os-selection">
                <h3>Supported OS</h3>
                <div className="uploadgame-gametype-os-options">
                  {["Windows", "Mac", "Linux"].map((os) => (
                    <div
                      key={os}
                      className={`uploadgame-gametype-os-option ${
                        data.supportedOS.includes(os) ? "active" : ""
                      }`}
                      onClick={() => toggleOS(os)}
                    >
                      {os}
                    </div>
                  ))}
                </div>
              </div>

              <div className="uploadgame-gametype-requirements">
                <h3>Minimum System Requirements</h3>
                <textarea
                  placeholder="Enter minimum system requirements..."
                  value={data.systemRequirements || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      systemRequirements: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}
        </>
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

          <button type="submit" className="uploadgame-btn next-btn">
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default UploadGameType;
