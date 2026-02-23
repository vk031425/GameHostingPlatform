import { useRef } from "react";
import "./UploadGameType.css";

const UploadGameType = ({ data, setData, nextStep, prevStep }) => {
  const buildRef = useRef(null);

  const selectType = (type) => {
    setData({
      ...data,
      distributionType: type,
      buildFile: null,
      folderName: "",
    });
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleFolderChange = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) {
      alert("Folder is empty.");
      return;
    }

    const folderName = files[0].webkitRelativePath.split("/")[0];
    // Check index.html at root
    const indexFile = files.find(
      (file) =>
        file.name.toLowerCase() === "index.html" &&
        file.webkitRelativePath.split("/").length === 2,
    );

    if (!indexFile) {
      alert("Folder must contain index.html at root level.");
      return;
    }

    // Check index.html not empty
    if (indexFile.size === 0) {
      alert("index.html is empty.");
      return;
    }

    // Block dangerous file types
    const blockedExtensions = [".php", ".exe", ".bat", ".sh", ".py"];
    const hasBlockedFile = files.some((file) =>
      blockedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)),
    );

    if (hasBlockedFile) {
      alert("Folder contains forbidden file types.");
      return;
    }

    // Optional: limit total folder size (500MB)
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 500 * 1024 * 1024) {
      alert("Folder exceeds 500MB limit.");
      return;
    }

    setData({
      ...data,
      webFiles: files,
      folderName: folderName,
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

    if (data.distributionType === "browser" && !data.webFiles.length) {
      alert("Upload game folder");
      return;
    }

    if (data.distributionType === "download" && !data.buildFile) {
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
                  ? "Upload Web Game Folder"
                  : "Upload Game File"}
              </h3>
            </div>
            <div
              className="uploadgame-gametype-upload-dropzone"
              onClick={() => buildRef.current.click()}
            >
              {data.distributionType === "browser" ? (
                data.webFiles?.length > 0 ? (
                  <div className="file-info">
                    <p>
                      <strong>{data.folderName}</strong>
                    </p>
                    <span>{data.webFiles.length} files selected</span>
                  </div>
                ) : (
                  <div className="uploadgame-gametype-upload-drop-placeholder">
                    <p>
                      Drag & Drop or Click here to upload Game Folder containing
                      index.html file
                    </p>
                    <span>Max size: 500MB</span>
                  </div>
                )
              ) : (
                <div className="uploadgame-gametype-upload-drop-placeholder">
                  <p>Drag & Drop .zip / .exe File</p>
                  <span>Max size: 500MB</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={buildRef}
              hidden
              multiple
              webkitdirectory="true"
              directory=""
              onChange={handleFolderChange}
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
