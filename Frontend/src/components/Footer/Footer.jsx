import "./Footer.css"
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
        <hr className="gradient-hr"/>
      <div className="footer">
        <ul>
          <li>
            <Link className="footer-links" to="/about">
              About
            </Link>
          </li>
          <li>
            <Link className="footer-links" to="/about">
              Developers
            </Link>
          </li>
          <li>
            <Link className="footer-links" to="/about">
              Terms
            </Link>
          </li>
          <li>
            <Link className="footer-links" to="/about">
              Privacy
            </Link>
          </li>
        </ul>
        <p>© 2026 Game Hoster</p>
      </div>
    </footer>
  );
};

export default Footer;
