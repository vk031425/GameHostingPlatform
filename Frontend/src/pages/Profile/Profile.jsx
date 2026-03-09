import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CDN_BASE_URL } from "../../utils/constants";
import ProfileOverview from "../../components/Profile/ProfileOverview/ProfileOverview";
import ProfileMyGames from "../../components/Profile/ProfileMyGames/ProfileMyGames";
import ProfileWishList from "../../components/Profile/ProfileWishList/ProfileWishList";
import ProfileFavorites from "../../components/Profile/ProfileFavorites/ProfileFavorites";
import ProfileSettings from "../../components/Profile/ProfileSettings/ProfileSettings";
import API from "../../config/api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();

  const profilepicUrl = authData
    ? `${CDN_BASE_URL}/${authData.user.profilepic}`
    : "/images/fallback-thumbnail.jpg";

  const buttonHandler = (e) => {
    setActiveTab(e.currentTarget.value);
  };

  const handleLogout = async () => {
    try {
      await API.post("/user/logout");

      setAuthData({
        user: null,
        isLoggedIn: false,
        loading: false,
      });

      navigate("/", { replace: true }); // Force homepage
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-page-sidebar">
        <div className="profile-main">
          <img src={profilepicUrl} alt="profilepic" />
          <h1>{authData.user.username}</h1>
          <p>{authData.user.email}</p>
        </div>

        <button className="profile-switch-btn">
          <Link className="developer-page-link" to="/developer">
            Go to Developer Profile
          </Link>
        </button>

        <div className="profile-sidebar-btn-container">
          <button
            onClick={buttonHandler}
            value="Overview"
            className="profile-sidebar-btn"
          >
            <i class="fa-solid fa-magnifying-glass-chart"></i>
            <p>Overview</p>
          </button>
          <button
            onClick={buttonHandler}
            value="Mygames"
            className="profile-sidebar-btn"
          >
            <i class="fa-solid fa-folder"></i>
            <p>My Games</p>
          </button>
          <button
            onClick={buttonHandler}
            value="Wishlist"
            className="profile-sidebar-btn"
          >
            <i class="fa-solid fa-heart"></i>
            <p>Wishlist</p>
          </button>
          <button
            onClick={buttonHandler}
            value="Favorites"
            className="profile-sidebar-btn"
          >
            <i class="fa-solid fa-star"></i>
            <p>Favorites</p>
          </button>
          <button
            onClick={buttonHandler}
            value="Settings"
            className="profile-sidebar-btn"
          >
            <i class="fa-solid fa-gear"></i>
            <p>Settings</p>
          </button>
          <button className="profile-sidebar-btn" onClick={handleLogout}>
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <p>Log Out</p>
          </button>
        </div>
      </div>
      <div className="profile-page-right">
        {activeTab === "Overview" && (
          <ProfileOverview setActiveTab={setActiveTab} />
        )}
        {activeTab === "Mygames" && <ProfileMyGames />}
        {activeTab === "Wishlist" && <ProfileWishList />}
        {activeTab === "Favorites" && <ProfileFavorites />}
        {activeTab === "Settings" && <ProfileSettings />}
      </div>
    </div>
  );
};

export default Profile;
