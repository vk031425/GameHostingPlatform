import "./Navbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {
  const { authData } = useContext(AuthContext);
  return (
    <div className="navbar-container">
      <Link id="title" to="/">
        GameHoster
      </Link>
      <ul id="mid-tabs">
        <li>
          <Link className="nav-links" to="/games">
            Games
          </Link>
        </li>
        <li>
          <Link className="nav-links" to="/games">
            Categories
          </Link>
        </li>
        <li>
          <Link className="nav-links" to="/games">
            Trending
          </Link>
        </li>
      </ul>

      <ul id="right-tabs">
        {authData.isLoggedIn ? (
          <li>
            <Link className="nav-links" to="/profile">
              Profile
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link className="nav-links" to="/signin">
                Sign In
              </Link>
            </li>
            <li>
              <Link className="nav-links" to="/signup">
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
