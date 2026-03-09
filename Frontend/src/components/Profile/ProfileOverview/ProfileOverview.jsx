import "./ProfileOverview.css";
import { useEffect, useState } from "react";
import API from "../../../config/api";
import ProfileGameCard from "../ProfileGameCard/ProfileGameCard";
import { formatDate } from "../../../utils/formatDate";

const ProfileOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await API.get("/user/overview");

        setStats(res.data.stats);
        setRecentlyPlayed(res.data.recentlyPlayed);
        setFavorites(res.data.favorites);
        setWishlist(res.data.wishlist);
      } catch (err) {
        console.error("Failed to load overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <p style={{ color: "white" }}>Loading overview...</p>;
  }

  return (
    <div className="profile-overview-container">
      {/* ================= TOP STATS ================= */}
      {stats && (
        <section className="profile-overview-top">
          <div className="profile-overview-top-element">
            <div className="profile-overview-top-element-top">
              <i className="fa-solid fa-gamepad"></i>
              <h1>{stats.gamesPlayed}</h1>
            </div>
            <h1>Games Played</h1>
          </div>

          <div className="profile-overview-top-element">
            <div className="profile-overview-top-element-top">
              <i className="fa-solid fa-cart-shopping"></i>
              <h1>{stats.purchasedCount}</h1>
            </div>
            <h1>Games Purchased</h1>
          </div>

          <div className="profile-overview-top-element">
            <div className="profile-overview-top-element-top">
              <i className="fa-solid fa-star"></i>
              <h1>{stats.reviewsPosted}</h1>
            </div>
            <h1>Reviews Posted</h1>
          </div>

          <div className="profile-overview-top-element">
            <div className="profile-overview-top-element-top">
              <i className="fa-solid fa-calendar"></i>
              <h1 style={{ fontSize: "1.8rem" }}>
                {formatDate(stats.joinedAt, true)}
              </h1>
            </div>
            <h1>Joined In</h1>
          </div>
        </section>
      )}

      {/* ================= RECENTLY PLAYED ================= */}
      <section className="profile-overview-recently-played">
        <div className="recently-played-top">
          <h1>Recently Played</h1>
        </div>

        <div className="recently-played-card-container">
          {recentlyPlayed.length === 0 && (
            <p style={{ color: "white" }}>No recently played games.</p>
          )}

          {recentlyPlayed.map((game) => (
            <ProfileGameCard key={game._id} game={game} showRemove={false} />
          ))}
        </div>
      </section>

      {/* ================= FAVORITES ================= */}
      <section className="profile-overview-recently-played">
        <div className="recently-played-top">
          <h1>Favorites</h1>
          <button onClick={() => setActiveTab("Favorites")}>View All</button>
        </div>

        <div className="recently-played-card-container">
          {favorites.length === 0 && (
            <p style={{ color: "white" }}>No favorite games yet.</p>
          )}

          {favorites.map((game) => (
            <ProfileGameCard key={game._id} game={game} showRemove={false} />
          ))}
        </div>
      </section>

      {/* ================= WISHLIST ================= */}
      <section className="profile-overview-recently-played">
        <div className="recently-played-top">
          <h1>Wishlist</h1>
          <button onClick={() => setActiveTab("Wishlist")}>View All</button>
        </div>

        <div className="recently-played-card-container">
          {wishlist.length === 0 && (
            <p style={{ color: "white" }}>No games in wishlist.</p>
          )}

          {wishlist.map((game) => (
            <ProfileGameCard key={game._id} game={game} showRemove={false} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileOverview;
