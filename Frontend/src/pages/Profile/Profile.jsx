import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import {Link} from "react-router-dom";
import ProfileOverview from "../../components/Profile/ProfileOverview/ProfileOverview";
import ProfileMyGames from "../../components/Profile/ProfileMyGames/ProfileMyGames";
import ProfileWishList from "../../components/Profile/ProfileWishList/ProfileWishList";
import ProfileFavorites from "../../components/Profile/ProfileFavorites/ProfileFavorites";
import ProfileComments from "../../components/Profile/ProfileComments/ProfileComments";
import ProfileSettings from "../../components/Profile/ProfileSettings/ProfileSettings";

const Profile = () => {
  const { authData } = useContext(AuthContext);
  const [righttab, setrighttab] = useState(<ProfileOverview/>);

  const buttonHandler = (e)=>{
    const val = e.currentTarget.value;
    if(val === "Overview"){
        setrighttab(<ProfileOverview/>);
    }
    else if(val === "Mygames"){
        setrighttab(<ProfileMyGames/>);
    }
    else if(val === "Wishlist"){
        setrighttab(<ProfileWishList/>);
    }
    else if(val === "Favorites"){
        setrighttab(<ProfileFavorites/>);
    }
    else if(val === "Comments"){
        setrighttab(<ProfileComments/>);
    }
    else if(val === "Settings"){
        setrighttab(<ProfileSettings/>);
    }
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-sidebar">
        <div className="profile-main">
          <img src={authData.user.profilepic} alt="profilepic" />
          <h1>{authData.user.username}</h1>
          <p>{authData.user.email}</p>
        </div>

        <button className="profile-switch-btn">
          <Link className="developer-page-link" to="/developer">Go to Developer Profile</Link>
        </button>

        <div className="profile-sidebar-btn-container">
          <button onClick={buttonHandler} value="Overview" className="profile-sidebar-btn">
            <i class="fa-solid fa-magnifying-glass-chart"></i>
            <p>Overview</p>
          </button>
          <button onClick={buttonHandler} value="Mygames"className="profile-sidebar-btn">
            <i class="fa-solid fa-folder"></i>
            <p>My Games</p>
          </button>
          <button onClick={buttonHandler} value="Wishlist" className="profile-sidebar-btn">
            <i class="fa-solid fa-heart"></i>
            <p>Wishlist</p>
          </button>
          <button onClick={buttonHandler} value="Favorites" className="profile-sidebar-btn">
            <i class="fa-solid fa-star"></i>
            <p>Favorites</p>
          </button>
          <button onClick={buttonHandler} value="Comments" className="profile-sidebar-btn">
            <i class="fa-solid fa-comment"></i>
            <p>Comments</p>
          </button>
          <button onClick={buttonHandler} value="Settings" className="profile-sidebar-btn">
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
        {righttab}
      </div>
    </div>
  );
};

export default Profile;
