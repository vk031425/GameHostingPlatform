import "./DeveloperProfileOverview.css";
import { useEffect, useState } from "react";
import API from "../../../config/api";
import ProfileGameCard from "../../Profile/ProfileGameCard/ProfileGameCard";

const DeveloperProfileOverview = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalViews: 0,
    totalPlays: 0,
    totalDownloads: 0,
    avgRating: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await API.get("/developer/overview");
        setStats(res.data);
        console.log("Developer overview stats:", res.data);
      } catch (err) {
        console.error("Failed to fetch developer overview:", err);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="developer-overview-container">
      {/* Top Stats Section */}
      <div className="developer-overview-top">
        <div className="developer-overview-card">
          <div className="developer-overview-card-top">
            <i className="fa-solid fa-gamepad"></i>
            <h1>{stats.totalGames}</h1>
          </div>
          <p>Total Games</p>
        </div>

        <div className="developer-overview-card">
          <div className="developer-overview-card-top">
            <i className="fa-solid fa-eye"></i>
            <h1>{stats.totalViews}</h1>
          </div>
          <p>Total Views</p>
        </div>

        <div className="developer-overview-card">
          <div className="developer-overview-card-top">
            <i className="fa-solid fa-play"></i>
            <h1>{stats.totalPlays}</h1>
          </div>
          <p>Total Plays</p>
        </div>

        <div className="developer-overview-card">
          <div className="developer-overview-card-top">
            <i className="fa-solid fa-download"></i>
            <h1>{stats.totalDownloads}</h1>
          </div>
          <p>Total Downloads</p>
        </div>

        <div className="developer-overview-card">
          <div className="developer-overview-card-top">
            <i className="fa-solid fa-star"></i>
            <h1>{stats.avgRating.toFixed(1)}</h1>
          </div>
          <p>Average Rating</p>
        </div>

        <div className="developer-overview-card">
          <div className="developer-overview-card-top">
            <i className="fa-solid fa-indian-rupee-sign"></i>
            <h1>{stats.totalRevenue}</h1>
          </div>
          <p>Total Revenue</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="developer-overview-bottom">
        <div className="developer-overview-bottom-top">
          <h1>Your Recent Uploads</h1>
        </div>

        <div className="developer-overview-recent-container">
          {stats.recentGames && stats.recentGames.length > 0 ? (
            stats.recentGames.map((game) => (
              <ProfileGameCard key={game._id} game={game} showRemove = {false} />
            ))
          ) : (
            <p>No recent uploads yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfileOverview;
