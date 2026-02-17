import "./ProfileOverview.css";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import GameCard from "../../GameCard/GameCard";

const ProfileOverview = () => {
  const { authData } = useContext(AuthContext);

  return (
    <div className="profile-overview-container">
      <section className="profile-overview-top">
        <div className="profile-overview-top-element">
          <div className="profile-overview-top-element-top">
            <i class="fa-solid fa-gamepad"></i>
            <h1>{authData.gamesPlayed}</h1>
          </div>
          <h1>Games Played</h1>
        </div>
        <div className="profile-overview-top-element">
          <div className="profile-overview-top-element-top">
            <i class="fa-solid fa-cart-shopping"></i>
            <h1>{authData.purchasedGames.length}</h1>
          </div>
          <h1>Games Purchased</h1>
        </div>
        <div className="profile-overview-top-element">
          <div className="profile-overview-top-element-top">
            <i class="fa-solid fa-star"></i>
            <h1>{authData.reviewsPosted}</h1>
          </div>
          <h1>Reviews Posted</h1>
        </div>
        <div className="profile-overview-top-element">
          <div className="profile-overview-top-element-top">
            <i class="fa-solid fa-calendar"></i>
            <h1 style={{ fontSize: "2rem" }}>{authData.createdAt}</h1>
          </div>
          <h1>Joined In</h1>
        </div>
      </section>
      <section className="profile-overview-recently-played">
        <div className="recently-played-top">
          <h1>Recently Played</h1>
        </div>
        <div className="recently-played-card-container">
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
        </div>
      </section>
      <section className="profile-overview-recently-played">
        <div className="recently-played-top">
          <h1>Favorites</h1>
          <button>View All</button>
        </div>
        <div className="recently-played-card-container">
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
        </div>
      </section>
      <section className="profile-overview-recently-played">
        <div className="recently-played-top">
          <h1>WishList</h1>
          <button>View All</button>
        </div>
        <div className="recently-played-card-container">
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
          <GameCard
            source="/images/home/FeaturedGames/lulf.jpg"
            title="Wonder Fighter"
            gameId="wonder123"
          />
        </div>
      </section>
    </div>
  );
};

export default ProfileOverview;
