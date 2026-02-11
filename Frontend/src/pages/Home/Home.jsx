import "./Home.css";
import { Link } from "react-router-dom";
import FeaturedGameCard from "../../components/FeaturedGameCard/FeaturedGameCard";

const Home = () => {
  return (
    <div className="home-container">
      <section className="home-top">
        <div className="home-top-left">
          <h1>
            Play Amazing <br />
            <span id="webgame-highlight">Web Games </span>
            Instantly
          </h1>
          <p>
            No downloads. No installs. <br /> Just click and play in the
            browser.
          </p>
          <div className="home-top-left-buttons">
            <button style={{ backgroundColor: "#2563EB" }}>
              <Link
                style={{ color: "white", textDecoration: "none" }}
                to="/games"
              >
                Explore Games
              </Link>
            </button>
            <button
              style={{
                backgroundColor: "#111630",
                border: "1px solid white",
              }}
            >
              <Link
                style={{ color: "white", textDecoration: "none" }}
                to="/games"
              >
                For Developers
              </Link>
            </button>
          </div>
        </div>
        <div className="laptop-wrapper">
          <img
            className="laptop-frame"
            src="/images/home/laptopframe.png"
            alt="frame"
          />
          <img
            className="laptop-screen"
            src="/images/home/laptopcontentimage.jpg"
            alt="content"
          />
        </div>
      </section>
      <hr />
      <section className="home-middle">
        <div className="home-middle-top">
          <h1>Featured Games</h1>
          <button>
            <Link className="viewall-button" to="/games">
              View All
            </Link>
          </button>
        </div>
        <div className="featured-games-container">
          <FeaturedGameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/game2.jpg"
            title="Tom Clancy | Ghost Recon"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/tombraider.jpg"
            title="The Rise Of Tomb Raider"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
          />
        </div>
        <div className="home-middle-bottom">
          <h1>Trending Games</h1>
          <button>
            <Link className="viewall-button" to="/games">
              View All
            </Link>
          </button>
        </div>
        <div className="featured-games-container">
          <FeaturedGameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            cardtag="NEW"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/game2.jpg"
            title="Tom Clancy | Ghost Recon"
            cardtag="HOT"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/tombraider.jpg"
            title="The Rise Of Tomb Raider"
            cardtag="HOT"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
          />
          <FeaturedGameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
          />
        </div>
      </section>

      <section className="home-bottom">
        <div className="home-bottom-container">
          <h1>Are you a game developer?</h1>
          <h2>
            Upload your game and reach players <b>instantly</b>
          </h2>
          <button>
            <Link className="home-bottom-container-buttonlink" to="/games">
              Start Hosting Games
            </Link>
          </button>
        </div>
      </section>
      <hr />
      <footer className="home-footer-container">
        <div className="home-footer">
          <ul>
            <li>
              <Link className="home-footer-links" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="home-footer-links" to="/about">
                Developers
              </Link>
            </li>
            <li>
              <Link className="home-footer-links" to="/about">
                Terms
              </Link>
            </li>
            <li>
              <Link className="home-footer-links" to="/about">
                Privacy
              </Link>
            </li>
          </ul>
          <p>© 2026 Game Hoster</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
