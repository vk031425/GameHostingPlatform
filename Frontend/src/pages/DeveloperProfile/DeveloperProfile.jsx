import "./DeveloperProfile.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CDN_BASE_URL } from "../../utils/constants";

import DeveloperProfileUpload from "../../components/DeveloperProfile/DeveloperProfileUpload/DeveloperProfileUpload";
import DeveloperProfileOverview from "../../components/DeveloperProfile/DeveloperProfileOverview/DeveloperProfileOverview";
import DeveloperProfileMyGames from "../../components/DeveloperProfile/DeveloperProfileMyGames/DeveloperProfileMyGames";
import DeveloperProfileEditGame from "../../components/DeveloperProfile/DeveloperProfileEditGame/DeveloperProfileEditGame";

const DeveloperProfile = () => {
  const { authData } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedGameId, setSelectedGameId] = useState(null);

  const profilepicUrl = authData
    ? `${CDN_BASE_URL}/${authData.user.profilepic}`
    : "/images/fallback-thumbnail.jpg";

  const openEditGame = (gameId) => {
    setSelectedGameId(gameId);
    setActiveTab("EditGame");
  };

  return (
    <div className="developer-profile-page-container">
      <div className="developer-profile-page-sidebar">
        <div className="developer-profile-main">
          <img src={profilepicUrl} alt="profilepic" />
          <h1>{authData.user.username}</h1>
          <p>{authData.user.email}</p>
        </div>

        <button className="developer-profile-switch-btn">
          <Link className="profile-page-link" to="/profile">
            Go to Player Profile
          </Link>
        </button>

        <div className="developer-profile-sidebar-btn-container">
          <button
            onClick={() => setActiveTab("Overview")}
            className="developer-profile-sidebar-btn"
          >
            <i className="fa-solid fa-magnifying-glass-chart"></i>
            <p>Dashboard</p>
          </button>

          <button
            onClick={() => setActiveTab("MyGames")}
            className="developer-profile-sidebar-btn"
          >
            <i className="fa-solid fa-gamepad"></i>
            <p>My Games</p>
          </button>

          <button
            onClick={() => setActiveTab("UploadGame")}
            className="developer-profile-sidebar-btn"
          >
            <i className="fa-solid fa-upload"></i>
            <p>Upload Game</p>
          </button>
        </div>
      </div>

      <div className="developer-profile-page-right">
        {activeTab === "Overview" && <DeveloperProfileOverview />}
        {activeTab === "MyGames" && (
          <DeveloperProfileMyGames onEdit={openEditGame} />
        )}
        {activeTab === "UploadGame" && <DeveloperProfileUpload />}
        {activeTab === "EditGame" && (
          <DeveloperProfileEditGame gameId={selectedGameId} />
        )}
      </div>
    </div>
  );
};

export default DeveloperProfile;
