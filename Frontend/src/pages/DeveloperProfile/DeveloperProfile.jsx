import "./DeveloperProfile.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import DeveloperProfileUpload from "../../components/DeveloperProfile/DeveloperProfileUpload/DeveloperProfileUpload";
import DeveloperProfileOverview from "../../components/DeveloperProfile/DeveloperProfileOverview/DeveloperProfileOverview";

const DeveloperProfile = () => {
  const { authData } = useContext(AuthContext);
  const [righttab, setrighttab] = useState(<DeveloperProfileOverview />);

  const buttonHandler = (e) => {
    const val = e.currentTarget.value;
    if (val === "Overview") {
      setrighttab(<DeveloperProfileOverview />);
    } else if (val === "Mygames") {
      // setrighttab(<ProfileMyGames />);
    } else if (val === "UploadGame") {
      setrighttab(<DeveloperProfileUpload/>);
    } else if (val === "Favorites") {
      // setrighttab(<ProfileFavorites />);
    } else if (val === "Comments") {
      // setrighttab(<ProfileComments />);
    } else if (val === "Settings") {
      // setrighttab(<ProfileSettings />);
    }
  };

  return (
    <div className="developer-profile-page-container">
      <div className="developer-profile-page-sidebar">
        <div className="developer-profile-main">
          <img src={authData.user.profilepic} alt="profilepic" />
          <h1>{authData.user.username}</h1>
          <p>{authData.user.email}</p>
        </div>

        <button className="developer-profile-switch-btn">
          <Link className="profile-page-link" to="/profile">
            Go to Player Profile
          </Link>
        </button>

        <div className="developer-profile-sidebar-btn-container">
          <button onClick={buttonHandler} value="Overview" className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-magnifying-glass-chart"></i>
            <p>Overview</p>
          </button>
          <button className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-gamepad"></i>
            <p>My Games</p>
          </button>
          <button onClick={buttonHandler} value="UploadGame" className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-upload"></i>
            <p>Upload Game</p>
          </button>
          <button className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-chart-line"></i>
            <p>Analytics</p>
          </button>
          <button className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-dollar-sign"></i>
            <p>Earnings</p>
          </button>
          <button className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-comment"></i>
            <p>Reviews</p>
          </button>
          <button className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-gear"></i>
            <p>Settings</p>
          </button>
          <button className="developer-profile-sidebar-btn">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <p>Log Out</p>
          </button>
        </div>
      </div>
      <div className="developer-profile-page-right">
        {righttab}
      </div>
    </div>
  );
};

export default DeveloperProfile;
