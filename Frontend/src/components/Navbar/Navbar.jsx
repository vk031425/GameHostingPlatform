import "./Navbar.css";
import {Link} from 'react-router-dom';

const Navbar = ()=>{
    return(
        <div className="navbar-container">
            <Link id="title" to="/">GameHoster</Link>
            <ul id="mid-tabs">
                <li>
                    <Link className="nav-links" to="/games">Games</Link>
                </li>
                <li>
                    <Link className="nav-links" to="/games">Categories</Link>
                </li>
                <li>
                    <Link className="nav-links" to="/games">Trending</Link>
                </li>
            </ul>

            <ul id="right-tabs">
                <li>
                    <Link className="nav-links" to="/games">Sign in</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar;