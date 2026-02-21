import { data, useParams } from "react-router-dom";
import { useState, version } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./GamePlay.css";
import { Link } from "react-router-dom";
import PurchaseGameCard from "../../components/PurchaseGameCard/PurchaseGameCard";
import PlayGameCard from "../../components/PlayGameCard/PlayGameCard";
import DownloadGameCard from "../../components/DownloadGameCard/DownloadGameCard";
import RatingCard from "../../components/RatingCard/RatingCard";

const GamePlay = () => {
  const { gameId } = useParams();
  const {authData, setAuthData} = useContext(AuthContext);
  const [gamedata, setgameData] = useState({
    gameName: "",
    tags: [],
    description: "",
    subscription: "",
    playtype: "",
    releaseDate: "",
    developer: "",
    version: "",
    price: "",
    ratings: [],
  });

  const getgameData = () => {
    // const response = await API.get("/games/tombraider213");
    const response = {
      gameName: "WonderFighter",
      tags: ["Fighting", "Multiplayer", "Casual", "Action"],
      description:
        "Wonder Fighter a fighting game in which player come online and fight with each other. Very intersting game. Play can use in game coins to upgrade their moves on the basis of power.",
      subscription: "Paid",
      playtype: "download",
      releaseDate: "14 February, 2026",
      developer: "VK Gamers",
      version: "1.0.0",
      price: "6.9",
      ratings: [256,34,12,15,10],
    };
    setgameData(response);
  };

  let purchased = false;
  if(authData.isLoggedIn === true){
    purchased = authData.user.purchasedGames.includes(gamedata.gameName);
  }
  else{
    purchased = false;
  }

  const getTopRightCard = () => {
    if (gamedata.subscription === "Paid" && !purchased) {
      return <PurchaseGameCard price={gamedata.price} />;
    } else if (gamedata.playtype === "browser") {
      return <PlayGameCard />;
    } else {
      return <DownloadGameCard />;
    }
  };

  useEffect(() => {
    getgameData();
  }, []);

  return (
    <div>
      <div className="gameplay-page-container">
        <h1 id="game-title">{gamedata.gameName}</h1>
        <section className="gameplay-top-section">
          <div className="gameplay-top-left">
            <div className="gameplay-playscreen">
              {/* this will be the play area */}
            </div>
            <h1>About this game</h1>
            <div className="gameplay-game-tags">
              {gamedata.tags.map((tag) => (
                <button key={tag} className="gameplay-tag-button">
                  {tag}
                </button>
              ))}
            </div>
            <p>{gamedata.description}</p>
          </div>
          <div className="gameplay-top-right">
            <div className="gameplay-gamedetails-card">
              <h1>Game Details</h1>
              <hr />
              <div className="gameplay-gamedetails">
                <div className="detail">
                  <p>Release Date</p>
                  <p>{gamedata.releaseDate}</p>
                </div>
                <div className="detail">
                  <p>Developer</p>
                  <p>{gamedata.developer}</p>
                </div>
                <div className="detail">
                  <p>Version</p>
                  <p>{gamedata.version}</p>
                </div>
                <div className="detail">
                  <p>Subscription</p>
                  <p>{gamedata.subscription}</p>
                </div>
              </div>
            </div>
            {getTopRightCard()}
            <RatingCard ratings={gamedata.ratings} />
          </div>
        </section>

        <section className="comment-section">
          <h1>Comments</h1>
        </section>
      </div>
    </div>
  );
};

export default GamePlay;
