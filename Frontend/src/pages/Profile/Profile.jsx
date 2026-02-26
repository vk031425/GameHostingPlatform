import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import ProfileOverview from "../../components/Profile/ProfileOverview/ProfileOverview";
import ProfileMyGames from "../../components/Profile/ProfileMyGames/ProfileMyGames";
import ProfileWishList from "../../components/Profile/ProfileWishList/ProfileWishList";
import ProfileFavorites from "../../components/Profile/ProfileFavorites/ProfileFavorites";
import ProfileSettings from "../../components/Profile/ProfileSettings/ProfileSettings";

const Profile = () => {
  const { authData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Overview");

  const buttonHandler = (e) => {
    setActiveTab(e.currentTarget.value);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-page-sidebar">
        <div className="profile-main">
          <img src={authData.user.profilepic} alt="profilepic" />
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
          <button className="profile-sidebar-btn">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <p>Log Out</p>
          </button>
        </div>
      </div>
      <div className="profile-page-right">
        {activeTab === "Overview" && <ProfileOverview />}
        {activeTab === "Mygames" && <ProfileMyGames />}
        {activeTab === "Wishlist" && <ProfileWishList />}
        {activeTab === "Favorites" && <ProfileFavorites />}
        {activeTab === "Settings" && <ProfileSettings />}
      </div>
    </div>
  );
};

export default Profile;
